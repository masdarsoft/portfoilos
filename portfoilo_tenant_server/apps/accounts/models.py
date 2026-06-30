"""
apps/accounts/models.py
------------------------
Custom TenantUser model extending Django's AbstractUser.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class TenantUser(AbstractUser):
    """
    Custom user model. Each user belongs to exactly one tenant.
    Roles control what actions the user can perform in the admin.
    """

    ROLE_CHOICES = [
        ("owner",  "Owner"),
        ("editor", "Editor"),
        ("viewer", "Viewer"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="editor")
    avatar = models.ImageField(upload_to="accounts/avatars/", blank=True)

    class Meta:
        verbose_name = "Tenant User"
        verbose_name_plural = "Tenant Users"

    def __str__(self) -> str:
        tenant_name = self.tenant.name if self.tenant else "No Tenant"
        return f"{self.get_full_name()} ({tenant_name} — {self.role})"
