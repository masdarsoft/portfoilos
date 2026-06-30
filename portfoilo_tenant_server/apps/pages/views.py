"""apps/pages/views.py — Stub views. Implement per Phase 4 of multitenant_prompts.md."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

class PageListPublicView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, domain): return Response([])

class PagePublicView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, domain, slug): return Response({})

class PageAdminListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): return Response([])
    def post(self, request): return Response({}, status=201)

class PageAdminDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug): return Response({})
    def put(self, request, slug): return Response({})
    def patch(self, request, slug): return Response({})
    def delete(self, request, slug): return Response(status=204)

class PageReorderView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request): return Response({})

class TabAdminListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug): return Response([])
    def post(self, request, slug): return Response({}, status=201)

class TabAdminDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug, tab_id): return Response({})
    def put(self, request, slug, tab_id): return Response({})
    def patch(self, request, slug, tab_id): return Response({})
    def delete(self, request, slug, tab_id): return Response(status=204)

class TabReorderView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, slug): return Response({})

class BlockAdminListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug): return Response([])
    def post(self, request, slug): return Response({}, status=201)

class BlockAdminDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, slug, block_id): return Response({})
    def put(self, request, slug, block_id): return Response({})
    def patch(self, request, slug, block_id): return Response({})
    def delete(self, request, slug, block_id): return Response(status=204)

class BlockReorderView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, slug): return Response({})
