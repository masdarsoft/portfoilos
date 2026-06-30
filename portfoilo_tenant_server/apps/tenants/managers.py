"""
apps/tenants/managers.py
------------------------
Custom manager for the Tenant model.
"""
from django.db import models


class TenantQuerySet(models.QuerySet):
    def active(self):
        """Return only tenants that are live/active."""
        return self.filter(is_active=True)


class TenantManager(models.Manager):
    def get_queryset(self) -> TenantQuerySet:
        return TenantQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def get_by_host(self, host: str):
        """
        Resolve a request host to a Tenant.
        Checks custom_domain first, then strips to subdomain slug.

        Args:
            host: The raw HTTP Host header (e.g. 'najd-al-zain.najdalzian.com')
        Returns:
            Tenant instance or raises Tenant.DoesNotExist
        """
        # 1. Try exact custom domain match
        try:
            return self.active().get(custom_domain=host)
        except self.model.DoesNotExist:
            pass

        # 2. Extract subdomain from host (e.g. 'najd-al-zain' from 'najd-al-zain.najdalzian.com')
        subdomain = host.split(".")[0]
        return self.active().get(subdomain=subdomain)
