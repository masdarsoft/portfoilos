"""apps/tenants/urls.py"""
from django.urls import path
from .views import TenantResolveView, TenantDetailView, TenantThemeView, TenantAnalyticsView

app_name = "tenants"

urlpatterns = [
    path("resolve/",         TenantResolveView.as_view(),    name="resolve"),
    path("me/",              TenantDetailView.as_view(),     name="detail"),
    path("me/theme/",        TenantThemeView.as_view(),      name="theme"),
    path("me/analytics/",    TenantAnalyticsView.as_view(),  name="analytics"),
]
