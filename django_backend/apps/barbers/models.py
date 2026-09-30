from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django_backend.apps.services.models import Service

class BarberProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='barber_profile',
        verbose_name=_("حساب کاربری")
    )
    title = models.CharField(max_length=150, verbose_name=_("عنوان شغلی (مثلاً استایلیست ارشد)"))
    bio = models.TextField(verbose_name=_("بیوگرافی و سوابق تخصصی"))
    avatar = models.ImageField(upload_to='barbers/', blank=True, null=True, verbose_name=_("تصویر چهره"))
    experience_years = models.PositiveIntegerField(default=5, verbose_name=_("سال‌های سابقه کار"))
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0, verbose_name=_("امتیاز میانگین"))
    reviews_count = models.PositiveIntegerField(default=0, verbose_name=_("تعداد نظرات ثبت‌شده"))
    is_active = models.BooleanField(default=True, verbose_name=_("مشغول به کار در سالن"))
    services = models.ManyToManyField(
        Service,
        through='BarberService',
        related_name='barbers',
        verbose_name=_("خدمات قابل ارائه")
    )

    class Meta:
        verbose_name = _("پروفایل آرایشگر")
        verbose_name_plural = _("آرایشگران")

    def __str__(self):
        return self.user.get_full_name() or self.user.phone

class BarberService(models.Model):
    barber = models.ForeignKey(BarberProfile, on_delete=models.CASCADE, verbose_name=_("آرایشگر"))
    service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name=_("خدمت"))
    custom_price = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True, verbose_name=_("قیمت اختصاصی"))
    custom_duration = models.PositiveIntegerField(null=True, blank=True, verbose_name=_("مدت اختصاصی"))

    class Meta:
        unique_together = ('barber', 'service')
        verbose_name = _("خدمت آرایشگر")
        verbose_name_plural = _("خدمات آرایشگران")

class DayOfWeek(models.IntegerChoices):
    SATURDAY = 0, _("شنبه")
    SUNDAY = 1, _("یکشنبه")
    MONDAY = 2, _("دوشنبه")
    TUESDAY = 3, _("سه‌شنبه")
    WEDNESDAY = 4, _("چهارشنبه")
    THURSDAY = 5, _("پنج‌شنبه")
    FRIDAY = 6, _("جمعه")

class WorkingHour(models.Model):
    barber = models.ForeignKey(
        BarberProfile,
        on_delete=models.CASCADE,
        related_name='working_hours',
        verbose_name=_("آرایشگر")
    )
    day_of_week = models.IntegerField(choices=DayOfWeek.choices, verbose_name=_("روز هفته"))
    is_open = models.BooleanField(default=True, verbose_name=_("روز کاری فعال"))
    start_time = models.TimeField(verbose_name=_("ساعت شروع شیفت"))
    end_time = models.TimeField(verbose_name=_("ساعت پایان شیفت"))
    break_start = models.TimeField(null=True, blank=True, verbose_name=_("شروع زمان استراحت"))
    break_end = models.TimeField(null=True, blank=True, verbose_name=_("پایان زمان استراحت"))

    class Meta:
        unique_together = ('barber', 'day_of_week')
        verbose_name = _("ساعت کاری")
        verbose_name_plural = _("ساعات کاری آرایشگران")

class DayOff(models.Model):
    barber = models.ForeignKey(
        BarberProfile,
        on_delete=models.CASCADE,
        related_name='days_off',
        null=True,
        blank=True,
        verbose_name=_("آرایشگر (خالی یعنی تعطیلی کل سالن)")
    )
    date = models.DateField(verbose_name=_("تاریخ مرخصی یا تعطیلی"))
    reason = models.CharField(max_length=255, blank=True, verbose_name=_("علت تعطیلی"))

    class Meta:
        verbose_name = _("روز تعطیل یا مرخصی")
        verbose_name_plural = _("روزهای تعطیل")
