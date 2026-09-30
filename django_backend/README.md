# راهنمای استقرار و راه‌اندازی بک‌اند جنگو (BarberShop Backend)

این پوشه شامل معماری ماژولار و تمیز جنگو (Django + Django REST Framework) برای سامانه پیرایش مردانه «باربرشاپ» است.

---

## ۱. ساختار ماژولار پروژه (Architecture)

```text
django_backend/
├── config/                  # تنظیمات اصلی پروژه و URLها
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/                    # اپلیکیشن‌های مستقل
│   ├── accounts/            # احراز هویت، کاربر سفارشی بر پایه موبایل و RBAC
│   ├── services/            # خدمات و دسته‌بندی‌ها
│   ├── barbers/             # آرایشگران، ساعات کاری، شیفت و تعطیلات
│   ├── bookings/            # رزرواسیون و موتور محاسبه زمان‌های آزاد بدون تداخل
│   ├── products/            # فروشگاه و انبارداری کالاها
│   ├── orders/              # سفارش‌ها، سبد خرید و کوپن تخفیف
│   ├── payments/            # لاجیک اتصال به درگاه‌های شاپرک/زرین‌پال
│   └── notifications/       # ارسال پیامک‌های OTP و یادآوری نوبت
├── requirements.txt         # وابستگی‌های پایتون
└── README.md
```

---

## ۲. پیش‌نیازها و نصب وابستگی‌ها

ابتدا یک محیط مجازی (virtualenv) ایجاد و فعال فرمایید:

```bash
# ایجاد محیط مجازی
python -m venv venv

# فعال‌سازی در لینوکس / مک
source venv/bin/activate

# فعال‌سازی در ویندوز
.\venv\Scripts\activate

# نصب پکیج‌ها
pip install -r django_backend/requirements.txt
```

---

## ۳. متغیرهای محیطی (.env)

یک فایل `.env` در ریشه جنگو ایجاد نمایید:

```env
SECRET_KEY=your-super-secret-django-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# دیتابیس (در محیط توسعه SQLite و در پروداکشن PostgreSQL)
DATABASE_URL=postgres://user:password@localhost:5432/barbershop_db

# درگاه پرداخت
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## ۴. اجرای مایگریشن‌ها و ایجاد سوپریوزر

```bash
# ساخت جداول دیتابیس
python manage.py makemigrations
python manage.py migrate

# ایجاد حساب مدیر ارشد
python manage.py createsuperuser
```

---

## ۵. اجرای سرور توسعه

```bash
python manage.py runserver 8000
```

مستندات APIها و اندپوینت محاسبه اسلات‌های بدون تداخل زمانی در مسیر:
`GET /api/bookings/available-slots/?barber_id=1&service_id=2&date=2024-10-15`
در دسترس خواهد بود.
