from django.urls import path

from .auth_views import LoginAPIView, MeAPIView, RefreshTokenAPIView, RegisterAPIView
from .cart_views import (
    CartAddAPIView,
    CartDetailAPIView,
    CartRemoveAPIView,
    CartUpdateAPIView,
)
from .views import CategoryListAPIView, ProductListAPIView

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('products/', ProductListAPIView.as_view(), name='product-list'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/register/', RegisterAPIView.as_view(), name='auth-register'),
    path('auth/refresh/', RefreshTokenAPIView.as_view(), name='auth-refresh'),
    path('auth/me/', MeAPIView.as_view(), name='auth-me'),
    path('cart/', CartDetailAPIView.as_view(), name='cart-detail'),
    path('cart/add/', CartAddAPIView.as_view(), name='cart-add'),
    path('cart/update/', CartUpdateAPIView.as_view(), name='cart-update'),
    path('cart/remove/', CartRemoveAPIView.as_view(), name='cart-remove'),
]
