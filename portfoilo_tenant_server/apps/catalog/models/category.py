"""apps/catalog/models/category.py — ServiceCategory model."""
from django.db import models
from core.models import TimestampedModel
from apps.tenants.models import Tenant


class ServiceCategory(TimestampedModel):
    """
    One rental service category per tenant (e.g., 'تأجير مكيفات').
    Contains all SEO, content, and display data needed to render a service page.
    """

    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="categories", verbose_name="Tenant"
    )
    slug = models.SlugField(verbose_name="Slug", help_text="e.g. 'ac-rentals'")
    title = models.CharField(max_length=255, verbose_name="Title")
    seo_title = models.CharField(max_length=255, verbose_name="SEO Title")
    description = models.TextField(verbose_name="Description")
    seo_description = models.TextField(blank=True, verbose_name="SEO Description")
    seo_keywords = models.JSONField(default=list, verbose_name="SEO Keywords")
    main_image = models.ImageField(upload_to="catalog/main/", verbose_name="Main Image")
    icon = models.CharField(max_length=100, blank=True, verbose_name="Icon (lucide name)")
    features = models.JSONField(default=list, verbose_name="Feature Bullets")
    blog_content = models.TextField(blank=True, verbose_name="Blog Content (Markdown)")
    display_order = models.PositiveIntegerField(default=0, verbose_name="Display Order")
    is_active = models.BooleanField(default=True, verbose_name="Active")

    class Meta:
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"
        unique_together = [("tenant", "slug")]
        ordering = ["display_order", "title"]

    def __str__(self) -> str:
        return f"{self.tenant.name} › {self.title}"
