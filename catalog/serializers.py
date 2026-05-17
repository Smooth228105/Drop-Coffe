from rest_framework import serializers

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
        if not obj.photo:
            return None

        photo = obj.photo.strip()
        if photo.startswith(('http://', 'https://')):
            return photo

        path = photo if photo.startswith('/') else f'/media/{photo.lstrip("/")}'
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(path)
        return path
