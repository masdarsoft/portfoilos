"""apps/bookings/views.py — Stub. Implement per Phase 5 of multitenant_prompts.md."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

class BookingCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request): return Response({'whatsapp_redirect_url': ''}, status=201)

class BookingAdminListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): return Response([])

class BookingAdminDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk): return Response({})
    def patch(self, request, pk): return Response({})
