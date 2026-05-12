from django.db import models


class Category(models.Model):
    slug = models.SlugField('Код', max_length=64, unique=True)
    title = models.CharField('Название', max_length=128)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['title']

    def __str__(self):
        return self.title


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Категория',
    )
    name = models.CharField('Название', max_length=255)
    price = models.DecimalField(
        'Цена',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    description = models.TextField('Описание', blank=True)
    photo = models.CharField('Фото (путь или URL)', max_length=500, blank=True)

    class Meta:
        verbose_name = 'Позиция'
        verbose_name_plural = 'Позиции'
        ordering = ['category', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['category', 'name'],
                name='catalog_product_unique_name_per_category',
            ),
        ]

    def __str__(self):
        return self.name
