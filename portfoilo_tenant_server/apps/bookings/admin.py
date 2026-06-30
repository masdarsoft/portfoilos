"""apps/bookings/admin.py"""
from django.contrib import admin
from .models import BookingRequest

@admin.register(BookingRequest)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'customer_phone', 'category', 'event_date', 'status', 'source', 'created_at']
    list_filter = ['status', 'source', 'tenant']
    search_fields = ['customer_name', 'customer_phone']
    readonly_fields = ['id', 'whatsapp_redirect_url', 'created_at', 'updated_at']
