from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError(_("شماره تلفن همراه الزامی است"))
        user = self.model(phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'superadmin')
        return self.create_user(phone, password, **extra_fields)

class UserRole(models.TextChoices):
    CUSTOMER = 'customer', _('مشتری')
    BARBER = 'barber', _('آرایشگر')
    STAFF = 'staff', _('کارمند')
    ADMIN = 'admin', _('مدیر سیستم')
    SUPERADMIN = 'superadmin', _('مدیر ارشد')

class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(max_length=11, unique=True, verbose_name=_("شماره تلفن همراه"))
    first_name = models.CharField(max_length=150, blank=True, verbose_name=_("نام"))
    last_name = models.CharField(max_length=150, blank=True, verbose_name=_("نام خانوادگی"))
    email = models.EmailField(blank=True, null=True, unique=True, verbose_name=_("ایمیل"))
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
        verbose_name=_("نقش کاربری")
    )
    is_active = models.BooleanField(default=True, verbose_name=_("فعال"))
    is_staff = models.BooleanField(default=False, verbose_name=_("دسترسی کارمندی"))
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name=_("تاریخ عضویت"))

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("کاربر")
        verbose_name_plural = _("کاربران")

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone})" if self.first_name else self.phone

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile', verbose_name=_("کاربر"))
    loyalty_points = models.PositiveIntegerField(default=0, verbose_name=_("امتیاز باشگاه مشتریان"))
    birth_date = models.DateField(null=True, blank=True, verbose_name=_("تاریخ تولد"))
    total_spent = models.DecimalField(max_digits=12, decimal_places=0, default=0, verbose_name=_("کل مبالغ پرداختی"))
    notes = models.TextField(blank=True, verbose_name=_("یادداشت‌های اختصاصی پوست و مو"))

    class Meta:
        verbose_name = _("پروفایل مشتری")
        verbose_name_plural = _("پروفایل مشتریان")

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses', verbose_name=_("کاربر"))
    title = models.CharField(max_length=100, default=_("منزل"), verbose_name=_("عنوان نشانی"))
    city = models.CharField(max_length=100, default="تهران", verbose_name=_("شهر"))
    postal_code = models.CharField(max_length=10, blank=True, verbose_name=_("کد پستی"))
    full_address = models.TextField(verbose_name=_("نشانی کامل"))
    is_default = models.BooleanField(default=False, verbose_name=_("نشانی پیش‌فرض"))

    class Meta:
        verbose_name = _("نشانی")
        verbose_name_plural = _("نشانی‌ها")
