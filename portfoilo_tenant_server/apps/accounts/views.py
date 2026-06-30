"""apps/accounts/views.py — Stub. Implement per Phase 6 of multitenant_prompts.md."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserProfileSerializer, ChangePasswordSerializer

class TokenObtainView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = LoginSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = s.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({'access': str(refresh.access_token), 'refresh': str(refresh)})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            RefreshToken(request.data['refresh']).blacklist()
        except Exception:
            pass
        return Response({'detail': 'Logged out.'})

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(UserProfileSerializer(request.user, context={'request': request}).data)
    def patch(self, request):
        s = UserProfileSerializer(request.user, data=request.data, partial=True, context={'request': request})
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        s = ChangePasswordSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(s.validated_data['old_password']):
            return Response({'detail': 'Wrong password.'}, status=400)
        user.set_password(s.validated_data['new_password'])
        user.save()
        return Response({'detail': 'Password updated.'})
