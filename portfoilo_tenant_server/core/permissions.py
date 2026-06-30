"""
core/permissions.py
-------------------
Custom DRF permission classes applied across all tenant-scoped views.
"""
from rest_framework.permissions import BasePermission


class IsTenantMember(BasePermission):
    """
    Grants access only if the authenticated user belongs to the same
    tenant as the object being accessed.

    Usage:
        class MyCategoryView(APIView):
            permission_classes = [IsAuthenticated, IsTenantMember]
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # obj must have a direct .tenant FK or be the Tenant itself
        tenant = getattr(obj, "tenant", obj)
        return tenant == request.user.tenant


class IsOwner(BasePermission):
    """
    Grants access only to users with role='owner'.
    Used for destructive or sensitive operations (theme updates, user management).
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "owner"
        )


class IsEditorOrAbove(BasePermission):
    """
    Grants access to users with role='owner' or role='editor'.
    Used for create/update operations on catalog and pages.
    """

    ALLOWED_ROLES = ("owner", "editor")

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in self.ALLOWED_ROLES
        )
