"""apps/tenants/admin.py"""
from django.contrib import admin
from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ["name", "subdomain", "custom_domain", "city", "is_active", "created_at"]
    list_filter = ["is_active", "language", "city"]
    search_fields = ["name", "subdomain", "custom_domain", "phone"]
    prepopulated_fields = {"subdomain": ("name",)}
    readonly_fields = ["id", "created_at", "updated_at"]
    fieldsets = [
        ("Identity",   {"fields": ["id", "name", "tagline", "subdomain", "custom_domain", "is_active"]}),
        ("Branding",   {"fields": ["logo", "favicon", "theme", "font_family"]}),
        ("Contact",    {"fields": ["phone", "whatsapp", "email", "address", "city", "geo_lat", "geo_lng"]}),
        ("Locale",     {"fields": ["language", "direction"]}),
        ("SEO",        {"fields": ["meta_title", "meta_description"]}),
        ("Analytics",  {"fields": ["analytics"]}),
        ("Timestamps", {"fields": ["created_at", "updated_at"], "classes": ["collapse"]}),
    ]
