from django.contrib.auth.models import User
from rest_framework import serializers

from .constants import MANAGER_ORDER_STATUSES
from .models import Order, OrderItem
from .serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'product',
            'product_name',
            'unit_price',
            'quantity',
            'line_total',
        )

    def get_line_total(self, obj: OrderItem) -> str:
        return str(obj.line_total)


class OrderUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user = OrderUserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'user',
            'status',
            'status_display',
            'total_price',
            'items',
            'created_at',
            'updated_at',
        )


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=MANAGER_ORDER_STATUSES)
