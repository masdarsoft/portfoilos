"""apps/catalog/urls.py"""
from django.urls import path
from . import views

app_name = "catalog"

urlpatterns = [
    # ── Public ────────────────────────────────────────────────────────────────
    path("",                                  views.CategoryListView.as_view(),         name="list"),
    path("<slug:slug>/",                      views.CategoryDetailView.as_view(),       name="detail"),

    # ── Admin ─────────────────────────────────────────────────────────────────
    path("admin/",                            views.CategoryAdminListView.as_view(),    name="admin-list"),
    path("admin/reorder/",                    views.CategoryReorderView.as_view(),      name="admin-reorder"),
    path("admin/<slug:slug>/",                views.CategoryAdminDetailView.as_view(),  name="admin-detail"),
    path("admin/<slug:slug>/gallery/",        views.GalleryAdminView.as_view(),         name="admin-gallery"),
    path("admin/<slug:slug>/gallery/<uuid:gid>/", views.GalleryDeleteView.as_view(),   name="admin-gallery-delete"),
    path("admin/<slug:slug>/reviews/",        views.ReviewAdminView.as_view(),          name="admin-reviews"),
]
