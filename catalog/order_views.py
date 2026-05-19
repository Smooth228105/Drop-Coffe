from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .cart_views import get_or_create_cart
from .constants import ROLE_ADMIN, ROLE_MANAGER
from .models import CartItem, Order, OrderItem
from .order_serializers import OrderSerializer, OrderStatusUpdateSerializer
from .permissions import IsAdmin, IsAuthenticatedClient, IsManager
from .role_utils import get_user_role


def get_orders_queryset(user):
    role = get_user_role(user)
    queryset = Order.objects.prefetch_related(
        'items__product__category',
        'user',
    ).select_related('user')
    if role in (ROLE_MANAGER, ROLE_ADMIN):
        return queryset
    return queryset.filter(user=user)


class OrderListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not IsAuthenticatedClient().has_permission(request, self):
            return Response(
                {'detail': 'Недостаточно прав.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        orders = get_orders_queryset(request.user)
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)


class OrderCheckoutAPIView(APIView):
    permission_classes = [IsAuthenticatedClient]

    @transaction.atomic
    def post(self, request):
        cart = get_or_create_cart(request.user)
        cart_items = list(
            CartItem.objects.select_related('product').filter(cart=cart),
        )
        if not cart_items:
            return Response(
                {'detail': 'Корзина пуста.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total = Decimal('0.00')
        order = Order.objects.create(user=request.user, total_price=total)

        order_items = []
        for item in cart_items:
            price = item.product.price or Decimal('0.00')
            total += price * item.quantity
            order_items.append(
                OrderItem(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    unit_price=price,
                    quantity=item.quantity,
                ),
            )

        OrderItem.objects.bulk_create(order_items)
        order.total_price = total
        order.save(update_fields=['total_price'])
        CartItem.objects.filter(cart=cart).delete()

        order = get_orders_queryset(request.user).get(pk=order.pk)
        return Response(
            OrderSerializer(order, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class OrderStatusUpdateAPIView(APIView):
    permission_classes = [IsManager]

    def patch(self, request, order_id: int):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response({'detail': 'Заказ не найден.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.status = serializer.validated_data['status']
        order.save(update_fields=['status', 'updated_at'])

        order = get_orders_queryset(request.user).get(pk=order.pk)
        return Response(OrderSerializer(order, context={'request': request}).data)


class OrderDeleteAPIView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, order_id: int):
        deleted, _ = Order.objects.filter(pk=order_id).delete()
        if not deleted:
            return Response({'detail': 'Заказ не найден.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
