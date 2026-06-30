"""apps/bookings/models/booking.py — BookingRequest model."""
from django.db import models
from core.models import TimestampedModel
from apps.tenants.models import Tenant
from apps.catalog.models import ServiceCategory


class BookingRequest(TimestampedModel):
    """Customer inquiry/booking submitted via the portfolio site."""

    STATUS_CHOICES = [
        ("new",        "New"),
        ("contacted",  "Contacted"),
        ("confirmed",  "Confirmed"),
        ("completed",  "Completed"),
        ("cancelled",  "Cancelled"),
    ]
    SOURCE_CHOICES = [
        ("website",   "Website"),
        ("whatsapp",  "WhatsApp"),
        ("phone",     "Phone"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="bookings")
    category = models.ForeignKey(
        ServiceCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings"
    )
    customer_name = models.CharField(max_length=200, verbose_name="Customer Name")
    customer_phone = models.CharField(max_length=30, verbose_name="Phone")
    customer_email = models.EmailField(blank=True, verbose_name="Email")
    event_date = models.DateField(null=True, blank=True, verbose_name="Event Date")
    event_type = models.CharField(max_length=100, blank=True, verbose_name="Event Type")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantity")
    notes = models.TextField(blank=True, verbose_name="Notes")
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="website")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    whatsapp_redirect_url = models.TextField(blank=True, verbose_name="WhatsApp Redirect URL")

    class Meta:
        verbose_name = "Booking Request"
        verbose_name_plural = "Booking Requests"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.customer_name} → {self.tenant.name} ({self.status})"
