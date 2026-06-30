"""
apps/tenants/views.py
----------------------
Views for tenant resolution (public) and tenant management (admin).
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter
from core.permissions import IsOwner
from .models import Tenant
from .serializers import (
    TenantPublicSerializer,
    TenantAdminSerializer,
    TenantThemeSerializer,
    TenantAnalyticsSerializer,
)


@extend_schema(tags=["Tenants"])
class TenantResolveView(APIView):
    """
    GET /api/v1/tenants/resolve/?domain=<host>
    Public endpoint used by Next.js middleware to resolve a domain to a tenant.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        summary="Resolve tenant by domain",
        parameters=[OpenApiParameter("domain", str, description="Full request host")],
        responses={200: TenantPublicSerializer},
    )
    def get(self, request):
        host = request.query_params.get("domain", "").strip().lower()
        if not host:
            return Response({"detail": "domain param required."}, status=400)
        try:
            tenant = Tenant.objects.get_by_host(host)
        except Tenant.DoesNotExist:
            return Response({"detail": "Tenant not found."}, status=404)
        return Response(TenantPublicSerializer(tenant, context={"request": request}).data)


@extend_schema(tags=["Tenants"])
class TenantDetailView(APIView):
    """
    GET  /api/v1/tenants/me/  — Return authenticated user's tenant.
    PUT  /api/v1/tenants/me/  — Full update.
    PATCH /api/v1/tenants/me/ — Partial update.
    """

    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.tenant

    @extend_schema(summary="Get my tenant", responses={200: TenantAdminSerializer})
    def get(self, request):
        s = TenantAdminSerializer(self.get_object(), context={"request": request})
        return Response(s.data)

    @extend_schema(summary="Update my tenant", request=TenantAdminSerializer, responses={200: TenantAdminSerializer})
    def put(self, request):
        s = TenantAdminSerializer(self.get_object(), data=request.data, context={"request": request})
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    @extend_schema(summary="Partial update my tenant", request=TenantAdminSerializer, responses={200: TenantAdminSerializer})
    def patch(self, request):
        s = TenantAdminSerializer(self.get_object(), data=request.data, partial=True, context={"request": request})
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)


@extend_schema(tags=["Tenants"])
class TenantThemeView(APIView):
    """PATCH /api/v1/tenants/me/theme/ — Owner-only theme color update."""

    permission_classes = [IsAuthenticated, IsOwner]

    @extend_schema(summary="Update tenant theme colors", request=TenantThemeSerializer, responses={200: TenantThemeSerializer})
    def patch(self, request):
        tenant = request.user.tenant
        s = TenantThemeSerializer(tenant, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)


@extend_schema(tags=["Tenants"])
class TenantAnalyticsView(APIView):
    """PATCH /api/v1/tenants/me/analytics/ — Owner-only analytics update."""

    permission_classes = [IsAuthenticated, IsOwner]

    @extend_schema(summary="Update analytics IDs", request=TenantAnalyticsSerializer, responses={200: TenantAnalyticsSerializer})
    def patch(self, request):
        tenant = request.user.tenant
        s = TenantAnalyticsSerializer(tenant, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)
