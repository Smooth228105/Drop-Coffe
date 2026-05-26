"""
URL configuration for project project.
"""
import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import RedirectView
from django.views.static import serve


def _serve_media_static():
    """Serve uploaded files when DEBUG or SERVE_MEDIA is enabled.

    django.conf.urls.static.static() adds no routes when DEBUG is False.
    """
    media_prefix = settings.MEDIA_URL.lstrip('/')
    static_prefix = settings.STATIC_URL.lstrip('/')
    return [
        re_path(
            rf'^{media_prefix}(?P<path>.*)$',
            serve,
            {'document_root': settings.MEDIA_ROOT},
        ),
        re_path(
            rf'^{static_prefix}(?P<path>.*)$',
            serve,
            {'document_root': settings.STATIC_ROOT},
        ),
    ]


def _serve_media_enabled():
    if settings.DEBUG:
        return True
    return os.environ.get('SERVE_MEDIA', '').lower() in ('1', 'true', 'yes', 'on')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('catalog.urls')),
]

if settings.DEBUG:
    urlpatterns.insert(
        0,
        path(
            '',
            RedirectView.as_view(url='http://127.0.0.1:5173/', permanent=False),
            name='frontend-redirect',
        ),
    )
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
elif _serve_media_enabled():
    urlpatterns += _serve_media_static()
