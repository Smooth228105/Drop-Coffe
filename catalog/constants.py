ROLE_CLIENT = 'client'
ROLE_MANAGER = 'manager'
ROLE_ADMIN = 'admin'

ROLE_CHOICES = (
    (ROLE_CLIENT, 'Клиент'),
    (ROLE_MANAGER, 'Менеджер'),
    (ROLE_ADMIN, 'Администратор'),
)

ORDER_STATUS_PROCESSING = 'processing'
ORDER_STATUS_PICKING = 'picking'
ORDER_STATUS_IN_DELIVERY = 'in_delivery'
ORDER_STATUS_DELIVERED = 'delivered'
ORDER_STATUS_CANCELLED = 'cancelled'

ORDER_STATUS_CHOICES = (
    (ORDER_STATUS_PROCESSING, 'Обработка заказа'),
    (ORDER_STATUS_PICKING, 'Сборка на складе'),
    (ORDER_STATUS_IN_DELIVERY, 'Доставлен по адресу'),
    (ORDER_STATUS_DELIVERED, 'Заказ доставлен'),
    (ORDER_STATUS_CANCELLED, 'Заказ отменен'),
)

MANAGER_ORDER_STATUSES = [choice[0] for choice in ORDER_STATUS_CHOICES]
