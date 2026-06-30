"""apps/pages/models/block.py — ContentBlock model."""
from django.db import models
from core.models import TimestampedModel
from .page import Page


class ContentBlock(TimestampedModel):
    """
    A single content section inside a Page.
    Each block_type has its own JSON schema for `content`.

    BLOCK TYPES & CONTENT SCHEMAS:
    ─────────────────────────────────────────────────────────────────────────────
    'hero'           → { headline, subheadline, cta_primary_text, cta_primary_url,
                         cta_secondary_text, cta_secondary_url, video_urls: [], poster_image }
    'services_grid'  → { title, subtitle, category_slugs: [] }
    'about'          → { heading, body_text, stats: [{label, value}], image_url }
    'gallery'        → { heading, layout: 'masonry|grid', category_slug }
    'contact'        → { heading, show_phone, show_whatsapp, show_email, show_map, map_embed_url }
    'faq'            → { heading, items: [{question, answer}] }
    'testimonials'   → { heading, category_slug }
    'text_banner'    → { text, background_color, text_color, align: 'center|right|left' }
    'custom_html'    → { html_content }
    ─────────────────────────────────────────────────────────────────────────────
    """

    BLOCK_TYPE_CHOICES = [
        ("hero",            "Hero Section"),
        ("services_grid",   "Services Grid"),
        ("about",           "About Us"),
        ("gallery",         "Gallery"),
        ("contact",         "Contact"),
        ("faq",             "FAQ"),
        ("testimonials",    "Testimonials"),
        ("text_banner",     "Text Banner"),
        ("custom_html",     "Custom HTML"),
    ]

    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="blocks")
    block_type = models.CharField(max_length=30, choices=BLOCK_TYPE_CHOICES)
    content = models.JSONField(default=dict, verbose_name="Block Content")
    display_order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Content Block"
        verbose_name_plural = "Content Blocks"
        ordering = ["display_order"]

    def __str__(self) -> str:
        return f"{self.page.slug} › {self.get_block_type_display()} (order: {self.display_order})"
