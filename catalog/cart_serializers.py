from rest_framework import serializers

from .models import Cart, CartItem, Product
from .serializers import ProductSerializer


class CartProductSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        fields = ('id', 'name', 'price', 'image', 'category')


class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'quantity', 'line_total')

    def get_line_total(self, obj: CartItem) -> str:
        return str(obj.line_total)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price', 'total_quantity', 'updated_at')

    def get_total_price(self, obj: Cart) -> str:
        return str(obj.total_price)

    def get_total_quantity(self, obj: Cart) -> int:
        return obj.total_quantity


class CartAddSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1, required=False)

    def validate_product_id(self, value: int) -> int:
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError('Товар не найден.')
        return value


class CartUpdateSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CartRemoveSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
