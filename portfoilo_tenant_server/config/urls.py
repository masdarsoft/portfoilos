"""
config/urls.py
--------------
Root URL configuration. All app routes are namespaced under /api/v1/.
API documentation is served at /api/docs/ and /api/redoc/.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # ── Django Admin ──────────────────────────────────────────────────────────
    path("admin/", admin.site.urls),

    # ── App API Routes ────────────────────────────────────────────────────────
    path("api/v1/auth/",      include("apps.accounts.urls",  namespace="accounts")),
    path("api/v1/tenants/",   include("apps.tenants.urls",   namespace="tenants")),
    path("api/v1/catalog/",   include("apps.catalog.urls",   namespace="catalog")),
    path("api/v1/pages/",     include("apps.pages.urls",     namespace="pages")),
    path("api/v1/bookings/",  include("apps.bookings.urls",  namespace="bookings")),

    # ── API Documentation (drf-spectacular) ──────────────────────────────────
    path("api/schema/",  SpectacularAPIView.as_view(),                            name="schema"),
    path("api/docs/",    SpectacularSwaggerView.as_view(url_name="schema"),       name="swagger-ui"),
    path("api/redoc/",   SpectacularRedocView.as_view(url_name="schema"),         name="redoc"),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    import debug_toolbar
    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
