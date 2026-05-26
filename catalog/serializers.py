from rest_framework import serializers

from .media_utils import resolve_media_url
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='title', read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name')


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'description', 'image', 'category')

    def get_image(self, obj: Product) -> str | None:
        return resolve_media_url(obj.photo)