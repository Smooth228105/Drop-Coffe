from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .permissions import IsAdmin
from .product_serializers import ProductWriteSerializer
from .serializers import ProductSerializer


class ProductCreateAPIView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        serializer = ProductWriteSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(
            ProductSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class ProductDetailAPIView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_product(self, product_id: int) -> Product | None:
        return Product.objects.select_related('category').filter(pk=product_id).first()

    def patch(self, request, product_id: int):
        product = self.get_product(product_id)
        if product is None:
            return Response({'detail': 'Товар не найден.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductWriteSerializer(
            product,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(ProductSerializer(product, context={'request': request}).data)

    def delete(self, request, product_id: int):
        product = self.get_product(product_id)
        if product is None:
            return Response({'detail': 'Товар не найден.'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
