import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django_backend.apps.barbers.models import BarberProfile
from django_backend.apps.services.models import Service

class AppointmentStatus(models.TextChoices):
    PENDING = 'pending', _('در انتظار تأیید')
    CONFIRMED = 'confirmed', _('تأیید شده')
    COMPLETED = 'completed', _('انجام شده')
    CANCELLED = 'cancelled', _('لغو شده')

class Appointment(models.Model):
    booking_code = models.CharField(
        max_length=20,
        unique=True,
        default=uuid.uuid4,
        verbose_name=_("کد پیگیری نوبت")
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name=_("مشتری")
    )
    barber = models.ForeignKey(
        BarberProfile,
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name=_("آرایشگر")
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='appointments',
        verbose_name=_("خدمت")
    )
    date = models.DateField(verbose_name=_("تاریخ مراجعه"))
    start_time = models.TimeField(verbose_name=_("ساعت شروع"))
    end_time = models.TimeField(verbose_name=_("ساعت پایان"))
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name=_("مبلغ قابل پرداخت (تومان)"))
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.CONFIRMED,
        verbose_name=_("وضعیت نوبت")
    )
    notes = models.TextField(blank=True, verbose_name=_("یادداشت یا توضیحات مدل مدنظر"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("زمان ثبت"))

    class Meta:
        verbose_name = _("نوبت رزرو")
        verbose_name_plural = _("نوبت‌های رزرو")
        ordering = ['-date', '-start_time']
        indexes = [
            models.Index(fields=['barber', 'date', 'status']),
            models.Index(fields=['booking_code']),
        ]

    def __str__(self):
        return f"{self.booking_code} - {self.customer} ({self.date} {self.start_time})"
