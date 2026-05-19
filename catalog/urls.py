from django.urls import path

from .auth_views import LoginAPIView, MeAPIView, RefreshTokenAPIView, RegisterAPIView
from .cart_views import (
    CartAddAPIView,
    CartDetailAPIView,
    CartRemoveAPIView,
    CartUpdateAPIView,
)
from .order_views import (
    OrderCheckoutAPIView,
    OrderDeleteAPIView,
    OrderListAPIView,
    OrderStatusUpdateAPIView,
)
from .product_views import ProductCreateAPIView, ProductDetailAPIView
from .views import CategoryListAPIView, ProductListAPIView

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('products/', ProductListAPIView.as_view(), name='product-list'),
    path('products/create/', ProductCreateAPIView.as_view(), name='product-create'),
    path('products/<int:product_id>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/register/', RegisterAPIView.as_view(), name='auth-register'),
    path('auth/refresh/', RefreshTokenAPIView.as_view(), name='auth-refresh'),
    path('auth/me/', MeAPIView.as_view(), name='auth-me'),
    path('cart/', CartDetailAPIView.as_view(), name='cart-detail'),
    path('cart/add/', CartAddAPIView.as_view(), name='cart-add'),
    path('cart/update/', CartUpdateAPIView.as_view(), name='cart-update'),
    path('cart/remove/', CartRemoveAPIView.as_view(), name='cart-remove'),
    path('orders/', OrderListAPIView.as_view(), name='order-list'),
    path('orders/checkout/', OrderCheckoutAPIView.as_view(), name='order-checkout'),
    path('orders/<int:order_id>/status/', OrderStatusUpdateAPIView.as_view(), name='order-status'),
    path('orders/<int:order_id>/', OrderDeleteAPIView.as_view(), name='order-delete'),
]
