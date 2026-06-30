from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from apps.tenants.models import Tenant
from .models.category import ServiceCategory
from .serializers import ServiceCategorySerializer

class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        domain = request.query_params.get("domain", "").strip().lower()
        if not domain:
            return Response({"detail": "domain parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tenant = Tenant.objects.get_by_host(domain)
        except Tenant.DoesNotExist:
            return Response({"detail": "Tenant not found for domain."}, status=status.HTTP_404_NOT_FOUND)

        categories = ServiceCategory.objects.filter(tenant=tenant, is_active=True)
        serializer = ServiceCategorySerializer(categories, many=True)
        return Response(serializer.data)

class CategoryDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        domain = request.query_params.get("domain", "").strip().lower()
        if not domain:
            return Response({"detail": "domain parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tenant = Tenant.objects.get_by_host(domain)
        except Tenant.DoesNotExist:
            return Response({"detail": "Tenant not found for domain."}, status=status.HTTP_404_NOT_FOUND)

        try:
            category = ServiceCategory.objects.get(tenant=tenant, slug=slug, is_active=True)
        except ServiceCategory.DoesNotExist:
            return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceCategorySerializer(category)
        return Response(serializer.data)

class CategoryAdminListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): return Response([])
    def post(self, request): return Response({}, status=201)

class CategoryAdminDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug): return Response({})
    def put(self, request, slug): return Response({})
    def patch(self, request, slug): return Response({})
    def delete(self, request, slug): return Response(status=204)

class CategoryReorderView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request): return Response({})

class GalleryAdminView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug): return Response([])
    def post(self, request, slug): return Response({}, status=201)

class GalleryDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, slug, gid): return Response(status=204)

class ReviewAdminView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug): return Response([])
    def post(self, request, slug): return Response({}, status=201)
