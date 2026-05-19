from rest_framework import serializers, status
from .permissions import IsAuthenticatedClient
from rest_framework.response import Response
from rest_framework.views import APIView

from .cart_serializers import (
    CartAddSerializer,
    CartItemSerializer,
    CartRemoveSerializer,
    CartSerializer,
    CartUpdateSerializer,
)
from .models import Cart, CartItem, Product


def get_or_create_cart(user) -> Cart:
    cart, _created = Cart.objects.get_or_create(user=user)
    return cart


class CartDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedClient]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        cart = Cart.objects.prefetch_related(
            'items__product__category',
        ).get(pk=cart.pk)
        return Response(CartSerializer(cart, context={'request': request}).data)


class CartAddAPIView(APIView):
    permission_classes = [IsAuthenticatedClient]

    def post(self, request):
        serializer = CartAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_cart(request.user)
        product = Product.objects.get(pk=serializer.validated_data['product_id'])
        quantity = serializer.validated_data.get('quantity', 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity},
        )
        if not created:
            item.quantity += quantity
            item.save(update_fields=['quantity'])

        item = CartItem.objects.select_related(
            'product__category',
        ).get(pk=item.pk)
        return Response(
            CartItemSerializer(item, context={'request': request}).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class CartUpdateAPIView(APIView):
    permission_classes = [IsAuthenticatedClient]

    def patch(self, request):
        serializer = CartUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_cart(request.user)
        try:
            item = CartItem.objects.select_related(
                'product__category',
            ).get(pk=serializer.validated_data['item_id'], cart=cart)
        except CartItem.DoesNotExist as exc:
            raise serializers.ValidationError({'item_id': 'Позиция не найдена.'}) from exc

        item.quantity = serializer.validated_data['quantity']
        item.save(update_fields=['quantity'])
        return Response(
            CartItemSerializer(item, context={'request': request}).data,
        )


class CartRemoveAPIView(APIView):
    permission_classes = [IsAuthenticatedClient]

    def delete(self, request):
        serializer = CartRemoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_cart(request.user)
        deleted, _ = CartItem.objects.filter(
            pk=serializer.validated_data['item_id'],
            cart=cart,
        ).delete()
        if not deleted:
            return Response(
                {'detail': 'Позиция не найдена.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)
