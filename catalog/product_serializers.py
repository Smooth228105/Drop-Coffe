import os
import uuid

from django.core.files.storage import default_storage
from rest_framework import serializers

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductWriteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
    )
    image = serializers.ImageField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = Product
        fields = ('name', 'price', 'description', 'category_id', 'image')

    def _save_image(self, image) -> str:
        extension = os.path.splitext(image.name)[1] or '.jpg'
        filename = f'products/{uuid.uuid4().hex}{extension}'
        path = default_storage.save(filename, image)
        return path

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        if image is not None:
            validated_data['photo'] = self._save_image(image)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)
        if image is not None:
            validated_data['photo'] = self._save_image(image)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        return ProductSerializer(instance, context=self.context).data
