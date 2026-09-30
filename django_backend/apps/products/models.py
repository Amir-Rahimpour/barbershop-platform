from django.db import models
from django.utils.translation import gettext_lazy as _

class ProductCategory(models.Model):
    name = models.CharField(max_length=150, verbose_name=_("نام دسته‌بندی"))
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name=_("اسلاگ یکتا"))
    description = models.TextField(blank=True, verbose_name=_("توضیحات"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("ترتیب"))

    class Meta:
        verbose_name = _("دسته‌بندی کالا")
        verbose_name_plural = _("دسته‌بندی‌های کالاها")

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name=_("دسته‌بندی")
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان فارسی محصول"))
    english_title = models.CharField(max_length=255, blank=True, verbose_name=_("عنوان لاتین"))
    brand = models.CharField(max_length=150, verbose_name=_("برند یا سازنده"))
    description = models.TextField(verbose_name=_("توضیحات و نحوه مصرف"))
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("قیمت اصلی (تومان)"))
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        null=True,
        blank=True,
        verbose_name=_("قیمت با تخفیف (تومان)")
    )
    stock = models.PositiveIntegerField(default=0, verbose_name=_("تعداد موجودی در انبار"))
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0, verbose_name=_("امتیاز میانگین"))
    reviews_count = models.PositiveIntegerField(default=0, verbose_name=_("تعداد نظرات"))
    is_featured = models.BooleanField(default=False, verbose_name=_("نمایش در کالاهای منتخب"))
    is_active = models.BooleanField(default=True, verbose_name=_("فعال و قابل فروش"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("محصول")
        verbose_name_plural = _("محصولات")

    def __str__(self):
        return f"{self.title} - {self.brand}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name=_("محصول"))
    image = models.ImageField(upload_to='products/', verbose_name=_("تصویر محصول"))
    is_primary = models.BooleanField(default=False, verbose_name=_("تصویر شاخص"))
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = _("تصویر محصول")
        verbose_name_plural = _("تصاویر محصولات")
