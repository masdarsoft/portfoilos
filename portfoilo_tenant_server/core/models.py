"""
core/models.py
--------------
Abstract base models shared across all Django apps.
Every app's model should inherit from TimestampedModel.
"""
import uuid
from django.db import models


class TimestampedModel(models.Model):
    """
    Abstract base model that provides:
    - id: UUID primary key (no sequential integers exposed in the API)
    - created_at: auto-set on insert
    - updated_at: auto-updated on every save
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        abstract = True
        ordering = ["-created_at"]
