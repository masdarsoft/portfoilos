"""apps/pages/admin.py"""
from django.contrib import admin
from .models import Page, PageTab, ContentBlock

class PageTabInline(admin.TabularInline):
    model = PageTab
    extra = 1

class ContentBlockInline(admin.StackedInline):
    model = ContentBlock
    extra = 0

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'tenant', 'page_type', 'is_published', 'display_order']
    list_filter = ['tenant', 'page_type', 'is_published']
    search_fields = ['title', 'slug']
    inlines = [PageTabInline, ContentBlockInline]
