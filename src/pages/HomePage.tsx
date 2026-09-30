import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  Sparkles,
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Award,
  Users
} from 'lucide-react';
import { formatToman, toPersianDigits, getUpcomingBookingDays, calculateAvailableSlots } from '../utils/persianDate';

export const HomePage: React.FC = () => {
  const {
    navigate,
    services,
    barbers,
    products,
    reviews,
    appointments,
    addToCart,
    toggleFavorite,
    isFavorite
  } = useApp();

  // Compute nearest available slots for today & tomorrow
  const upcomingDays = getUpcomingBookingDays(2);
  const primaryBarber = barbers[0];
  const primaryService = services[0];

  const quickSlotsToday = upcomingDays[0] && primaryBarber && primaryService
    ? calculateAvailableSlots(
        primaryBarber,
        primaryService,
        upcomingDays[0].dateStr,
        upcomingDays[0].dayOfWeek,
        appointments
      ).filter((s) => s.isAvailable).slice(0, 3)
    : [];

  const quickSlotsTomorrow = upcomingDays[1] && primaryBarber && primaryService
    ? calculateAvailableSlots(
        primaryBarber,
        primaryService,
        upcomingDays[1].dateStr,
        upcomingDays[1].dayOfWeek,
        appointments
      ).filter((s) => s.isAvailable).slice(0, 3)
    : [];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Start Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>اولین مرکز تخصصی پیرایش و اسکین‌کر آقایان</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                تجربه استایل اصیل و ماندگار؛
                <span className="block text-transparent bg-clip-text bg-gradient-to-l from-[#f1d279] via-[#d4af37] to-[#aa831c] mt-2">
                  هنر پیرایش مردانه در اوج کمال
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                در باربرشاپ رویال، هر کوتاهی مو و اصلاح ریش حاصل مشاوره اختصاصی چهره‌شناسی، متریال درجه‌یک اروپایی و دستان ماهر اساتید هیرکات است. بدون اتلاف وقت و با رزرو دقیق آنلاین در فضای اختصاصی آرامش‌بخش.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => navigate('booking')}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] bg-gradient-to-r from-[#d4af37] via-[#cfa82e] to-[#b89327] hover:from-[#e3bf4a] hover:to-[#c69f33] text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>رزرو آنلاین نوبت</span>
                </button>

                <button
                  onClick={() => navigate('services')}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 hover:text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center"
                >
                  مشاهده خدمات و تعرفه‌ها
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                    {toPersianDigits(11)}+
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">سال سابقه تخصصی</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#d4af37] tabular-nums">
                    {toPersianDigits(4.9)} ★
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">رضایت مشتریان</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                    ۱۰۰٪
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">بهداشت و استریل</div>
                </div>
              </div>
            </div>

            {/* Right/End Column: Visual Showcase & Next Slot Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-gradient-to-b from-[#181b22] to-[#121419] border border-white/10 p-6 shadow-2xl space-y-6">
                {/* Visual Header Inside Card */}
                <div className="relative h-56 rounded-xl overflow-hidden bg-[#1f232d] border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80"
                    alt="فضای داخلی باربرشاپ لوکس"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                    <div>
                      <span className="text-xs font-semibold text-[#d4af37]">سالن VIP سعادت‌آباد</span>
                      <h3 className="text-base font-bold text-white">اتاق‌های مجزا و خدمات اختصاصی</h3>
                    </div>
                  </div>
                </div>

                {/* Quick Next Appointment Slot Widget */}
                <div className="bg-[#121419] border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>نزدیک‌ترین زمان‌های خالی امروز:</span>
                    </span>
                    <button
                      onClick={() => navigate('available-appointments')}
                      className="text-xs text-[#d4af37] hover:underline"
                    >
                      مشاهده همه
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {quickSlotsToday.length > 0 ? (
                      quickSlotsToday.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            navigate('booking', {
                              serviceId: primaryService.id,
                              barberId: primaryBarber.id,
                              dateStr: upcomingDays[0].dateStr,
                              startTime: slot.startTime
                            })
                          }
                          className="py-2 px-1 bg-white/5 hover:bg-[#d4af37] hover:text-neutral-950 text-neutral-200 rounded-lg text-xs font-semibold tabular-nums transition-colors text-center border border-white/5"
                        >
                          {toPersianDigits(slot.startTime)}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-2 text-xs text-neutral-400">
                        برای امروز رزرو تکمیل است؛ نوبت‌های فردا را بررسی فرمایید.
                      </div>
                    )}
                  </div>
                </div>

                {/* Master Barber Badge */}
                <div className="flex items-center justify-between pt-1 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={primaryBarber.avatar}
                      alt={primaryBarber.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-[#d4af37]/40"
                    />
                    <div>
                      <p className="font-semibold text-white">{primaryBarber.name}</p>
                      <p className="text-[11px] text-neutral-400">{primaryBarber.title}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-[#d4af37] font-bold tabular-nums">{toPersianDigits(primaryBarber.rating)} ★</span>
                    <p className="text-[10px] text-neutral-500">{toPersianDigits(primaryBarber.reviewsCount)} نظر ثبت شده</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold mb-1">
              <Scissors className="w-3.5 h-3.5" />
              <span>منوی خدمات حرفه‌ای</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">خدمات ممتاز باربرشاپ</h2>
          </div>
          <button
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#d4af37] hover:text-[#e7c75a] transition-colors"
          >
            <span>مشاهده همه خدمات ({toPersianDigits(services.length)})</span>
            <ArrowLeft className="w-4 h-4 rtl-flip" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="group bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-neutral-900">
                  <img
                    src={service.image}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14161d] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    <span>{toPersianDigits(service.durationMinutes)} دقیقه</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs text-neutral-400">{service.categoryName}</div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/5 mt-4 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs text-neutral-400">تعرفه مصوب:</span>
                  <div className="text-right">
                    {service.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500 line-through tabular-nums">
                          {formatToman(service.price)}
                        </span>
                        <span className="text-sm font-bold text-[#d4af37] tabular-nums">
                          {formatToman(service.discountPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-white tabular-nums">
                        {formatToman(service.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('service-detail', { serviceId: service.id })}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium rounded-xl transition-colors text-center"
                  >
                    جزئیات
                  </button>
                  <button
                    onClick={() => navigate('booking', { serviceId: service.id })}
                    className="w-full py-2 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    رزرو نوبت
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Available Appointments Quick Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#13161c] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs text-[#d4af37] font-semibold">برنامه هفتگی آزاد</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">نوبت‌های خالی نزدیک</h2>
            </div>
            <button
              onClick={() => navigate('available-appointments')}
              className="text-xs sm:text-sm font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <span>مشاهده تمام تقویم و ساعات</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl-flip" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today Slots */}
            <div className="bg-[#0e1014] border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">{upcomingDays[0]?.displayLabel} (امروز)</span>
                </div>
                <span className="text-xs text-neutral-400">{primaryBarber.name}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {quickSlotsToday.length > 0 ? (
                  quickSlotsToday.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        navigate('booking', {
                          serviceId: primaryService.id,
                          barberId: primaryBarber.id,
                          dateStr: upcomingDays[0].dateStr,
                          startTime: slot.startTime
                        })
                      }
                      className="py-2.5 px-2 bg-white/5 hover:bg-[#d4af37] hover:text-neutral-950 text-neutral-200 rounded-lg text-xs font-semibold tabular-nums text-center transition-colors border border-white/5"
                    >
                      {toPersianDigits(slot.startTime)}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-center text-xs text-neutral-500">
                    نوبت‌های خالی امروز تکمیل شده است.
                  </div>
                )}
              </div>
            </div>

            {/* Tomorrow Slots */}
            <div className="bg-[#0e1014] border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                  <span className="text-sm font-bold text-white">{upcomingDays[1]?.displayLabel} (فردا)</span>
                </div>
                <span className="text-xs text-neutral-400">{primaryBarber.name}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {quickSlotsTomorrow.length > 0 ? (
                  quickSlotsTomorrow.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        navigate('booking', {
                          serviceId: primaryService.id,
                          barberId: primaryBarber.id,
                          dateStr: upcomingDays[1].dateStr,
                          startTime: slot.startTime
                        })
                      }
                      className="py-2.5 px-2 bg-white/5 hover:bg-[#d4af37] hover:text-neutral-950 text-neutral-200 rounded-lg text-xs font-semibold tabular-nums text-center transition-colors border border-white/5"
                    >
                      {toPersianDigits(slot.startTime)}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-center text-xs text-neutral-500">
                    برای فردا به نوبت‌های بعدی مراجعه فرمایید.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Shop Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>فروشگاه لوازم مراقبت شخصی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">محصولات منتخب و اورجینال</h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#d4af37] hover:text-[#e7c75a] transition-colors"
          >
            <span>ورود به فروشگاه</span>
            <ArrowLeft className="w-4 h-4 rtl-flip" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 bg-neutral-900 rounded-xl overflow-hidden mb-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {product.discountPrice && (
                    <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      تخفیف ویژه
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-rose-400 transition-colors"
                    aria-label="علاقه‌مندی"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isFavorite(product.id) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-neutral-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-neutral-400">{product.brand}</span>
                  <h3
                    onClick={() => navigate('product-detail', { productId: product.id })}
                    className="text-xs sm:text-sm font-bold text-white hover:text-[#d4af37] cursor-pointer line-clamp-2 transition-colors"
                  >
                    {product.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-amber-400">
                    <span>{toPersianDigits(product.rating)}</span>
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                  <div className="text-right">
                    {product.discountPrice ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-neutral-500 line-through tabular-nums">
                          {formatToman(product.price)}
                        </span>
                        <span className="text-xs font-bold text-[#d4af37] tabular-nums">
                          {formatToman(product.discountPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-white tabular-nums">
                        {formatToman(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-white/5 hover:bg-[#d4af37] hover:text-neutral-950 text-neutral-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>افزودن به سبد</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-[#d4af37] font-semibold">استانداردهای متمایز رویال</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">چرا آقایان باربرشاپ را برمی‌گزینند؟</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            ما پیرایش را از یک خدمت روزمره به یک تجربه باوقار و لذت‌بخش تبدیل کرده‌ایم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">زمان‌بندی دقیق و بدون معطلی</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              سیستم هوشمند رزرواسیون به شما تضمین می‌دهد که درست در دقیقه موعود بر روی صندلی پیرایش حضور داشته باشید.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">پروتکل‌های بهداشت بیمارستانی</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              تمامی تیغ‌ها، حوله‌ها و پیش‌بندها در بسته‌بندی تک‌نفره استریل در حضور شما باز و استفاده می‌شوند.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">مشاوره اختصاصی فرم صورت</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              قبل از هر بار کوتاهی، زاویه فک، خطوط جمجمه و فرم رویش مو بررسی می‌شود تا مناسب‌ترین استایل برای شما انتخاب شود.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">فضای آرامش‌بخش VIP</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              موسیقی لایت جز، رایحه دل‌نشین چوب صندل و پذیرایی با اسپرسوی تازه، محیطی دور از استرس شهر را برایتان فراهم می‌آورد.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs text-[#d4af37] font-semibold">دیدگاه همراهان</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">نظرات مشتریان وفادار ما</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#14161d] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  «{rev.comment}»
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{rev.authorName}</span>
                <span className="text-[11px] text-neutral-500">{rev.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#171a22] via-[#1c202a] to-[#171a22] border border-[#d4af37]/30 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              نوبت خود را همین حالا به آسانی رزرو کنید
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              کافیست خدمت مورد نظرتان را انتخاب کنید، آرایشگر و زمان دلخواه را برگزینید تا بدون نیاز به تماس تلفنی نوبت شما قطعی شود.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('booking')}
                className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0bd47] hover:to-[#c69f33] text-neutral-950 font-bold text-sm rounded-xl shadow-xl transition-all"
              >
                رزرو وقت حضوری
              </button>
              <button
                onClick={() => navigate('contact')}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium text-sm rounded-xl border border-white/10 transition-colors"
              >
                تماس و آدرس سالن
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
