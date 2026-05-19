from django.conf import settings
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


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
        verbose_name='Пользователь',
    )
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'

    def __str__(self):
        return f'Корзина {self.user.username}'

    @property
    def total_price(self):
        return sum(item.line_total for item in self.items.select_related('product'))

    @property
    def total_quantity(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Корзина',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name='Товар',
    )
    quantity = models.PositiveIntegerField('Количество', default=1)

    class Meta:
        verbose_name = 'Позиция корзины'
        verbose_name_plural = 'Позиции корзины'
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'product'],
                name='catalog_cartitem_unique_product_per_cart',
            ),
        ]

    def __str__(self):
        return f'{self.product.name} × {self.quantity}'

    @property
    def line_total(self):
        if self.product.price is None:
            return 0
        return self.product.price * self.quantity
