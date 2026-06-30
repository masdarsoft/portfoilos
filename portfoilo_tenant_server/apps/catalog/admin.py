"""apps/catalog/admin.py"""
from django.contrib import admin
from .models import ServiceCategory, CategoryGallery, ServiceReview

class GalleryInline(admin.TabularInline):
    model = CategoryGallery
    extra = 1

class ReviewInline(admin.TabularInline):
    model = ServiceReview
    extra = 0

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'tenant', 'slug', 'display_order', 'is_active']
    list_filter = ['tenant', 'is_active']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GalleryInline, ReviewInline]
