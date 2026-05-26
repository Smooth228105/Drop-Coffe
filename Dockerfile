FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py .
COPY project/ project/
COPY catalog/ catalog/
COPY docker/entrypoint.sh /app/docker/entrypoint.sh

# Seed data baked into image (copied to volumes on first run if empty)
COPY db.sqlite3 ./db.sqlite3
COPY media/ media_seed/

RUN chmod +x /app/docker/entrypoint.sh \
    && mkdir -p /app/data /app/media /app/staticfiles

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/categories/')" || exit 1

ENTRYPOINT ["/app/docker/entrypoint.sh"]
