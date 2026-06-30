"""
apps/tenants/models/tenant.py
------------------------------
Core Tenant model. One row = one customer portfolio site.
"""
from django.db import models
from core.models import TimestampedModel
from apps.tenants.managers import TenantManager


class Tenant(TimestampedModel):
    """
    Represents a single portfolio tenant (business/customer).
    Each tenant gets their own branded site accessible via subdomain or custom domain.
    """

    # ── Identity ──────────────────────────────────────────────────────────────
    subdomain = models.SlugField(
        unique=True,
        verbose_name="Subdomain",
        help_text="e.g. 'najd-al-zain' → najd-al-zain.najdalzian.com",
    )
    custom_domain = models.CharField(
        max_length=255,
        unique=True,
        blank=True,
        null=True,
        verbose_name="Custom Domain",
        help_text="Optional apex domain e.g. najdalzain.com",
    )
    name = models.CharField(max_length=255, verbose_name="Business Name")
    tagline = models.CharField(max_length=255, blank=True, verbose_name="Tagline")

    # ── Contact ───────────────────────────────────────────────────────────────
    phone = models.CharField(max_length=30, verbose_name="Phone")
    whatsapp = models.CharField(max_length=30, verbose_name="WhatsApp Number")
    email = models.EmailField(blank=True, verbose_name="Email")
    address = models.TextField(blank=True, verbose_name="Address")
    city = models.CharField(max_length=100, blank=True, verbose_name="City")
    geo_lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Latitude"
    )
    geo_lng = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Longitude"
    )

    # ── Branding ──────────────────────────────────────────────────────────────
    logo = models.ImageField(upload_to="tenants/logos/", verbose_name="Logo")
    favicon = models.ImageField(
        upload_to="tenants/favicons/", blank=True, verbose_name="Favicon"
    )
    theme = models.JSONField(
        default=dict,
        verbose_name="Theme Colors",
        help_text='e.g. {"primary":"#5B2D4A","dark":"#3B1B30","gold_accent":"#D4AF37"}',
    )

    # ── Analytics ─────────────────────────────────────────────────────────────
    analytics = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Analytics",
        help_text='e.g. {"gtm_id":"GTM-XXXX","ga_id":"G-XXXX"}',
    )

    # ── Locale & Typography ───────────────────────────────────────────────────
    LANGUAGE_CHOICES = [("ar", "Arabic"), ("en", "English")]
    DIRECTION_CHOICES = [("rtl", "Right to Left"), ("ltr", "Left to Right")]

    language = models.CharField(
        max_length=2, choices=LANGUAGE_CHOICES, default="ar", verbose_name="Language"
    )
    direction = models.CharField(
        max_length=3, choices=DIRECTION_CHOICES, default="rtl", verbose_name="Direction"
    )
    font_family = models.CharField(
        max_length=100, default="Tajawal", verbose_name="Font Family"
    )

    # ── SEO ───────────────────────────────────────────────────────────────────
    meta_title = models.CharField(max_length=255, blank=True, verbose_name="Meta Title")
    meta_description = models.TextField(blank=True, verbose_name="Meta Description")

    # ── Status ────────────────────────────────────────────────────────────────
    is_active = models.BooleanField(default=True, verbose_name="Is Active")

    objects = TenantManager()

    class Meta:
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
