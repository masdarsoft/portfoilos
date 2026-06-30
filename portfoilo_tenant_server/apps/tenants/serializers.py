"""
apps/tenants/serializers.py
----------------------------
Public and admin serializers for the Tenant model.
"""
from rest_framework import serializers
from .models import Tenant


class TenantPublicSerializer(serializers.ModelSerializer):
    """
    Read-only serializer returned to the Next.js frontend.
    Only exposes fields needed for rendering: branding, contact, theme, analytics.
    """

    class Meta:
        model = Tenant
        fields = [
            "id",
            "subdomain",
            "custom_domain",
            "name",
            "tagline",
            "phone",
            "whatsapp",
            "email",
            "address",
            "city",
            "geo_lat",
            "geo_lng",
            "logo",
            "favicon",
            "theme",
            "analytics",
            "language",
            "direction",
            "font_family",
            "meta_title",
            "meta_description",
        ]
        read_only_fields = fields


class TenantAdminSerializer(serializers.ModelSerializer):
    """Full serializer for authenticated tenant admin CRUD."""

    class Meta:
        model = Tenant
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class TenantThemeSerializer(serializers.ModelSerializer):
    """Partial serializer for theme-only updates (PATCH /tenants/me/theme/)."""

    class Meta:
        model = Tenant
        fields = ["theme"]


class TenantAnalyticsSerializer(serializers.ModelSerializer):
    """Partial serializer for analytics-only updates (PATCH /tenants/me/analytics/)."""

    class Meta:
        model = Tenant
        fields = ["analytics"]
