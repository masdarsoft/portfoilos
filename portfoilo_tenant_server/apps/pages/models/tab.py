"""apps/pages/models/tab.py — PageTab model."""
from django.db import models
from core.models import TimestampedModel
from .page import Page


class PageTab(TimestampedModel):
    """
    Horizontal scrollable tab pill shown in the header CategoryTabBar.
    Each tab links to a category, a custom URL, or an in-page anchor.
    """

    TAB_TYPE_CHOICES = [
        ("category_link", "Category Link"),
        ("custom_url", "Custom URL"),
        ("section_anchor", "Section Anchor"),
    ]

    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="tabs")
    label = models.CharField(max_length=100, verbose_name="Label")
    icon = models.CharField(max_length=100, blank=True, verbose_name="Icon (lucide name)")
    tab_type = models.CharField(max_length=20, choices=TAB_TYPE_CHOICES)
    link_value = models.CharField(
        max_length=255, verbose_name="Link Value",
        help_text="Slug, full URL, or #anchor-id depending on tab_type"
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Page Tab"
        verbose_name_plural = "Page Tabs"
        ordering = ["display_order"]

    def __str__(self) -> str:
        return f"{self.page.slug} › {self.label}"
