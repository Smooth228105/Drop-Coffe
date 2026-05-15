from __future__ import annotations

from decimal import Decimal, InvalidOperation
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from catalog.models import Category, Product

try:
    import openpyxl
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        'Нужен пакет openpyxl: pip install openpyxl'
    ) from exc

# Имя файла (без .xlsx) -> человекочитаемое название в админке
STEM_TO_TITLE = {
    'pies': 'Пироги',
    'baking': 'Выпечка',
    'bread': 'Хлеб',
    'cakes': 'Торты',
    'coffee': 'Кофе',
    'desserts': 'Десерты',
}


def _cell_str(value) -> str:
    if value is None:
        return ''
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _parse_price(value) -> Decimal | None:
    if value is None or value == '':
        return None
    if isinstance(value, (int, float)):
        return Decimal(str(value))
    text = str(value).strip().replace(',', '.').replace(' ', '')
    if not text:
        return None
    try:
        return Decimal(text)
    except (InvalidOperation, ValueError):
        return None


def _normalize_photo_key(name: str) -> str:
    """Ключ для сопоставления имени файла из xlsx с файлом в media/."""
    return ' '.join(name.replace('\xa0', ' ').split()).casefold()


def _build_media_index(media_dir: Path) -> dict[str, str]:
    """normalized_key -> фактическое имя файла в media/."""
    index: dict[str, str] = {}
    if not media_dir.is_dir():
        return index
    for path in media_dir.iterdir():
        if not path.is_file() or path.name.startswith('.'):
            continue
        key = _normalize_photo_key(path.name)
        index.setdefault(key, path.name)
    return index


def _resolve_photo_filename(raw: str, media_index: dict[str, str]) -> str:
    text = '' if raw is None else str(raw).strip()
    if not text:
        return ''
    basename = Path(text.replace('\\', '/')).name
    if basename in media_index.values():
        return basename[:500]
    resolved = media_index.get(_normalize_photo_key(basename))
    if resolved:
        return resolved[:500]
    return basename[:500]


class Command(BaseCommand):
    help = 'Импорт позиций из всех .xlsx в папке dropBD (колонки: название, цена, описание, фото).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все категории и позиции перед загрузкой',
        )
        parser.add_argument(
            '--dir',
            type=str,
            default=None,
            help='Папка с xlsx (по умолчанию: <BASE_DIR>/dropBD)',
        )

    def handle(self, *args, **options):
        base: Path = settings.BASE_DIR
        drop_dir = Path(options['dir']) if options['dir'] else base / 'dropBD'
        if not drop_dir.is_dir():
            self.stderr.write(self.style.ERROR(f'Папка не найдена: {drop_dir}'))
            return

        if options['clear']:
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.WARNING('Существующие данные каталога удалены.'))

        files = sorted(drop_dir.glob('*.xlsx'))
        if not files:
            self.stderr.write(self.style.WARNING(f'В {drop_dir} нет файлов .xlsx'))
            return

        media_dir = base / 'media'
        media_index = _build_media_index(media_dir)

        total_products = 0
        for path in files:
            stem = path.stem
            slug_source = stem.lower().replace(' ', '-')
            slug = slugify(slug_source) or slugify(stem)
            title = STEM_TO_TITLE.get(stem.lower(), stem.replace('_', ' ').strip())

            category, _created = Category.objects.update_or_create(
                slug=slug,
                defaults={'title': title},
            )

            wb = openpyxl.load_workbook(path, data_only=True)
            ws = wb.active
            rows = list(ws.iter_rows(values_only=True))
            wb.close()

            if not rows:
                self.stdout.write(f'{path.name}: пустой лист, пропуск')
                continue

            data_rows = rows[1:]
            n = 0
            for row in data_rows:
                if not row:
                    continue
                cells = list(row)
                name = _cell_str(cells[0]) if cells else ''
                if not name:
                    continue
                price = _parse_price(cells[1]) if len(cells) > 1 else None
                description = _cell_str(cells[2]) if len(cells) > 2 else ''
                photo = (
                    _resolve_photo_filename(cells[3], media_index)
                    if len(cells) > 3
                    else ''
                )

                Product.objects.update_or_create(
                    category=category,
                    name=name,
                    defaults={
                        'price': price,
                        'description': description,
                        'photo': photo,
                    },
                )
                n += 1

            self.stdout.write(self.style.SUCCESS(f'{path.name}: загружено позиций — {n}'))
            total_products += n

        self.stdout.write(
            self.style.SUCCESS(f'Готово. Всего файлов: {len(files)}, позиций обработано: {total_products}.')
        )
