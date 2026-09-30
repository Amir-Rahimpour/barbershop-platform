from django.db import models
from django.utils.translation import gettext_lazy as _

class ServiceCategory(models.Model):
    name = models.CharField(max_length=150, verbose_name=_("نام دسته‌بندی"))
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name=_("اسلاگ یکتا"))
    description = models.TextField(blank=True, verbose_name=_("توضیحات"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("ترتیب نمایش"))

    class Meta:
        verbose_name = _("دسته‌بندی خدمت")
        verbose_name_plural = _("دسته‌بندی‌های خدمات")
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class Service(models.Model):
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name='services',
        verbose_name=_("دسته‌بندی")
    )
    name = models.CharField(max_length=200, verbose_name=_("نام خدمت"))
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name=_("اسلاگ یکتا"))
    description = models.TextField(verbose_name=_("توضیحات و مراحل انجام"))
    duration_minutes = models.PositiveIntegerField(default=45, verbose_name=_("مدت زمان (دقیقه)"))
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("قیمت مصوب (تومان)"))
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        null=True,
        blank=True,
        verbose_name=_("قیمت با تخفیف (تومان)")
    )
    image = models.ImageField(upload_to='services/', blank=True, null=True, verbose_name=_("تصویر خدمت"))
    is_active = models.BooleanField(default=True, verbose_name=_("فعال و قابل رزرو"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("خدمت")
        verbose_name_plural = _("خدمات")

    def __str__(self):
        return f"{self.name} ({self.duration_minutes} دقیقه)"
