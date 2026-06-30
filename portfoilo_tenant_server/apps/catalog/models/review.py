"""apps/catalog/models/review.py — ServiceReview model."""
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from core.models import TimestampedModel
from .category import ServiceCategory


class ServiceReview(TimestampedModel):
    """Customer review for a specific service category."""

    category = models.ForeignKey(
        ServiceCategory, on_delete=models.CASCADE, related_name="reviews"
    )
    reviewer_name = models.CharField(max_length=150, verbose_name="Reviewer Name")
    city = models.CharField(max_length=100, blank=True, verbose_name="City")
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Rating (1-5)",
    )
    text = models.TextField(verbose_name="Review Text")
    review_date = models.CharField(
        max_length=10, blank=True, verbose_name="Review Date", help_text="e.g. '2026-04'"
    )
    is_visible = models.BooleanField(default=True, verbose_name="Visible")

    class Meta:
        verbose_name = "Service Review"
        verbose_name_plural = "Service Reviews"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.reviewer_name} — {self.rating}★ on {self.category.title}"
