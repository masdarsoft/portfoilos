"""apps/accounts/serializers.py"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import TenantUser


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        return {'user': user}


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'avatar']
        read_only_fields = ['id', 'username', 'role']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
