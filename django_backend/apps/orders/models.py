import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django_backend.apps.products.models import Product

class OrderStatus(models.TextChoices):
    PENDING = 'pending', _('در انتظار پرداخت')
    PROCESSING = 'processing', _('در حال بسته‌بندی')
    SHIPPED = 'shipped', _('تحویل به پست/پیک')
    DELIVERED = 'delivered', _('تحویل داده شده')
    CANCELLED = 'cancelled', _('لغو شده')

class PaymentMethod(models.TextChoices):
    ONLINE = 'online', _('درگاه پرداخت آنلاین شاپرک')
    CARD_TO_CARD = 'card_to_card', _('کارت به کارت')
    CASH_ON_DELIVERY = 'cash_on_delivery', _('پرداخت در محل')

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True, verbose_name=_("کد تخفیف"))
    discount_percent = models.PositiveIntegerField(verbose_name=_("درصد تخفیف"))
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("سقف تخفیف (تومان)"))
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name=_("حداقل سفارش"))
    is_active = models.BooleanField(default=True, verbose_name=_("فعال"))

    class Meta:
        verbose_name = _("کوپن تخفیف")
        verbose_name_plural = _("کوپن‌های تخفیف")

    def __str__(self):
        return f"{self.code} ({self.discount_percent}%)"

class Order(models.Model):
    order_number = models.CharField(
        max_length=20,
        unique=True,
        default=uuid.uuid4,
        verbose_name=_("شماره فاکتور")
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name=_("مشتری")
    )
    shipping_address = models.TextField(verbose_name=_("نشانی دقیق تحویل"))
    city = models.CharField(max_length=100, default="تهران", verbose_name=_("شهر"))
    subtotal = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("مجموع اقلام"))
    discount_amount = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name=_("مبلغ تخفیف"))
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name=_("هزینه ارسال"))
    total_amount = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("مبلغ نهایی پرداختی"))
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        verbose_name=_("وضعیت سفارش")
    )
    payment_method = models.CharField(
        max_length=30,
        choices=PaymentMethod.choices,
        default=PaymentMethod.ONLINE,
        verbose_name=_("روش پرداخت")
    )
    is_paid = models.BooleanField(default=False, verbose_name=_("وضعیت پرداخت"))
    tracking_code = models.CharField(max_length=50, blank=True, verbose_name=_("کد رهگیری پستی"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("سفارش")
        verbose_name_plural = _("سفارش‌ها")
        ordering = ['-created_at']

    def __str__(self):
        return f"سفارش {self.order_number} ({self.customer})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name=_("سفارش"))
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name=_("محصول"))
    quantity = models.PositiveIntegerField(default=1, verbose_name=_("تعداد"))
    unit_price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("قیمت واحد"))

    class Meta:
        verbose_name = _("آیتم سفارش")
        verbose_name_plural = _("آیتم‌های سفارش‌ها")
