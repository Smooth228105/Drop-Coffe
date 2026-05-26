# Docker — Drop Coffee

## Требования

- Docker 24+
- Docker Compose v2

## Быстрый старт

```bash
# 1. Скопировать переменные окружения
cp .env.example .env
# Отредактируйте SECRET_KEY в .env

# 2. Собрать и запустить
docker compose up --build
```

После запуска:

| Сервис | URL |
|--------|-----|
| Frontend (сайт + API через nginx) | http://localhost:3000 |
| Backend API (напрямую) | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |

## Сервисы

- **backend** — Django + Gunicorn (порт 8000)
- **frontend** — React build + Nginx (порт 3000)

## Персистентные данные

Docker volumes сохраняют данные между перезапусками:

| Volume | Содержимое |
|--------|------------|
| `sqlite_data` | SQLite база (`/app/data/db.sqlite3`) |
| `media_data` | Загруженные изображения товаров |
| `static_data` | Собранные static-файлы Django |

При **первом** запуске, если volumes пустые, entrypoint копирует `db.sqlite3` и `media/` из образа.

### Использовать существующую локальную БД и media

Остановите контейнеры и используйте override (важно: `!reset` убирает пустые named volumes):

```bash
cp docker-compose.override.example.yml docker-compose.override.yml
docker compose down
docker compose up --build
```

Фото раздаются через backend (`/app/media`), nginx на :3000 проксирует `/media/` на Django.

## Полезные команды

```bash
# Остановить
docker compose down

# Пересобрать без кэша
docker compose build --no-cache

# Логи
docker compose logs -f backend
docker compose logs -f frontend

# Django shell
docker compose exec backend python manage.py shell

# Назначить роль пользователю
docker compose exec backend python manage.py set_user_role demo manager

# Создать суперпользователя
docker compose exec backend python manage.py createsuperuser
```

## Переменные окружения

См. `.env.example`.

## Архитектура

```
Browser → :3000 (nginx frontend)
            ├── /          → React SPA
            ├── /api/*     → proxy → backend:8000
            ├── /media/*   → volume media_data
            └── /static/*  → volume static_data

Browser → :8000 (gunicorn) — прямой доступ к API
```
