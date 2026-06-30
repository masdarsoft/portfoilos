"""apps/pages/urls.py"""
from django.urls import path
from . import views

app_name = "pages"

urlpatterns = [
    # ── Public ────────────────────────────────────────────────────────────────
    path("<str:domain>/",                        views.PageListPublicView.as_view(),    name="list-public"),
    path("<str:domain>/<slug:slug>/",            views.PagePublicView.as_view(),        name="detail-public"),

    # ── Admin ─────────────────────────────────────────────────────────────────
    path("admin/",                               views.PageAdminListView.as_view(),     name="admin-list"),
    path("admin/reorder/",                       views.PageReorderView.as_view(),       name="admin-reorder"),
    path("admin/<slug:slug>/",                   views.PageAdminDetailView.as_view(),   name="admin-detail"),
    path("admin/<slug:slug>/tabs/",              views.TabAdminListView.as_view(),      name="admin-tab-list"),
    path("admin/<slug:slug>/tabs/reorder/",      views.TabReorderView.as_view(),        name="admin-tab-reorder"),
    path("admin/<slug:slug>/tabs/<uuid:tab_id>/",views.TabAdminDetailView.as_view(),    name="admin-tab-detail"),
    path("admin/<slug:slug>/blocks/",            views.BlockAdminListView.as_view(),    name="admin-block-list"),
    path("admin/<slug:slug>/blocks/reorder/",    views.BlockReorderView.as_view(),      name="admin-block-reorder"),
    path("admin/<slug:slug>/blocks/<uuid:block_id>/", views.BlockAdminDetailView.as_view(), name="admin-block-detail"),
]
