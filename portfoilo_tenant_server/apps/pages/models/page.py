"""apps/pages/models/page.py — Page model."""
from django.db import models
from core.models import TimestampedModel
from apps.tenants.models import Tenant


class Page(TimestampedModel):
    """A page in a tenant's portfolio site (home, about, services, custom...)."""

    PAGE_TYPE_CHOICES = [
        ("home", "Home"),
        ("services", "Services"),
        ("about", "About"),
        ("gallery", "Gallery"),
        ("contact", "Contact"),
        ("custom", "Custom"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="pages")
    title = models.CharField(max_length=255, verbose_name="Internal Title")
    slug = models.SlugField(verbose_name="URL Slug", help_text="e.g. 'home', 'about', 'services'")
    page_type = models.CharField(max_length=20, choices=PAGE_TYPE_CHOICES, default="custom")
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.JSONField(default=list, blank=True)
    og_image = models.ImageField(upload_to="pages/og/", blank=True)
    canonical_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Page"
        verbose_name_plural = "Pages"
        unique_together = [("tenant", "slug")]
        ordering = ["display_order"]

    def __str__(self) -> str:
        return f"{self.tenant.name} › {self.slug}"
