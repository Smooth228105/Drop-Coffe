#!/bin/sh
set -e

mkdir -p /app/data /app/media /app/staticfiles

if [ -z "${DATABASE_PATH}" ]; then
  export DATABASE_PATH=/app/data/db.sqlite3
fi

if [ ! -f "${DATABASE_PATH}" ] && [ -f /app/db.sqlite3 ]; then
  echo "Copying bundled SQLite database to persistent volume..."
  mkdir -p "$(dirname "${DATABASE_PATH}")"
  cp /app/db.sqlite3 "${DATABASE_PATH}"
fi

if [ -d /app/media_seed ] && [ -z "$(ls -A /app/media 2>/dev/null)" ]; then
  echo "Seeding media files..."
  cp -a /app/media_seed/. /app/media/
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn project.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-2}" \
  --timeout "${GUNICORN_TIMEOUT:-120}" \
  --access-logfile - \
  --error-logfile -
