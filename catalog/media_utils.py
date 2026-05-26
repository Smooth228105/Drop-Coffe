import os
from pathlib import Path
from urllib.parse import quote

from django.conf import settings


def _media_root() -> Path:
    return Path(settings.MEDIA_ROOT)


def resolve_media_url(photo) -> str | None:
    """Вернуть URL /media/... для существующего файла (с учётом пробелов в имени)."""
    if not photo:
        return None

    # CharField — строка; ImageField/FileField — объект с .name
    if hasattr(photo, 'name'):
        photo = photo.name

    raw = str(photo).replace('\xa0', ' ').strip()
    if not raw:
        return None

    if raw.startswith(('http://', 'https://')):
        return raw

    if raw.startswith('/media/'):
        name = raw[len('/media/') :].lstrip('/')
        return f'/media/{quote(name, safe="")}'

    basename = os.path.basename(raw.replace('\\', '/'))
    media_root = _media_root()

    if not media_root.is_dir():
        return f'/media/{quote(basename)}'

    relative_path = media_root / raw.lstrip('/')
    if relative_path.is_file():
        return f'/media/{quote(raw.lstrip("/"))}'

    exact_path = media_root / basename
    if exact_path.is_file():
        return f'/media/{quote(basename)}'

    # Поиск по имени без учёта лишних пробелов / регистра
    file_index: dict[str, str] = {}
    for entry in media_root.iterdir():
        if entry.is_file() and not entry.name.startswith('.'):
            file_index[entry.name.lower().strip()] = entry.name

    for candidate in (basename, raw.lstrip('/')):
        key = os.path.basename(candidate).lower().strip()
        if key in file_index:
            return f'/media/{quote(file_index[key])}'

    return f'/media/{quote(basename)}'
