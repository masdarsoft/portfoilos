"""apps/catalog/models/gallery.py — CategoryGallery model."""
from django.db import models
from core.models import TimestampedModel
from .category import ServiceCategory


class CategoryGallery(TimestampedModel):
    """Gallery images for a service category."""

    category = models.ForeignKey(
        ServiceCategory, on_delete=models.CASCADE, related_name="gallery_images"
    )
    image = models.ImageField(upload_to="catalog/gallery/", verbose_name="Image")
    caption = models.CharField(max_length=255, blank=True, verbose_name="Caption")
    display_order = models.PositiveIntegerField(default=0, verbose_name="Display Order")

    class Meta:
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"
        ordering = ["display_order"]

    def __str__(self) -> str:
        return f"{self.category.title} — image {self.display_order}"
