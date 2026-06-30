"""apps/bookings/urls.py"""
from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    path('',           views.BookingCreateView.as_view(),       name='create'),
    path('admin/',     views.BookingAdminListView.as_view(),    name='admin-list'),
    path('admin/<uuid:pk>/', views.BookingAdminDetailView.as_view(), name='admin-detail'),
]
