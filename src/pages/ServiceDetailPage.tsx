import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  Clock,
  CheckCircle2,
  Calendar,
  Star,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { formatToman, toPersianDigits, getUpcomingBookingDays, calculateAvailableSlots } from '../utils/persianDate';

export const ServiceDetailPage: React.FC = () => {
  const { services, barbers, appointments, routeParams, navigate } = useApp();

  const service =
    services.find((s) => s.id === routeParams.serviceId) || services[0];

  // Barbers who offer this service
  const serviceBarbers = barbers.filter((b) =>
    service.barberIds ? service.barberIds.includes(b.id) : true
  );

  // Available slots preview for the first barber
  const upcomingDays = getUpcomingBookingDays(3);
  const primaryBarber = serviceBarbers[0] || barbers[0];
  const previewSlots = primaryBarber
    ? calculateAvailableSlots(
        primaryBarber,
        service,
        upcomingDays[0].dateStr,
        upcomingDays[0].dayOfWeek,
        appointments
      ).filter((s) => s.isAvailable).slice(0, 4)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <button
        onClick={() => navigate('services')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowRight className="w-4 h-4 rtl-flip" />
        <span>بازگشت به لیست خدمات</span>
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left/Start Column: Image and Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative h-96 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
            <img
              src={service.image}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>مدت زمان: {toPersianDigits(service.durationMinutes)} دقیقه</span>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#14161d] border border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#d4af37] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">استریل کامل ابزار</span>
                <span className="text-neutral-400">پک ضدعفونی در حضور مشتری</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#14161d] border border-white/5 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-[#d4af37] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">اساتید با سابقه</span>
                <span className="text-neutral-400">بیش از ۷ سال سابقه کار تخصصی</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right/End Column: Service Description & Booking Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-[#d4af37] font-semibold">{service.categoryName}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{service.name}</h1>
            <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold">{toPersianDigits(service.rating)}</span>
              </div>
              <span>·</span>
              <span>{toPersianDigits(service.reviewsCount)} نظر ثبت شده</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 block">هزینه قطعی خدمت:</span>
              <span className="text-[11px] text-neutral-500">شامل تمامی مراحل و متریال مصرفی</span>
            </div>
            <div className="text-left">
              {service.discountPrice ? (
                <div>
                  <span className="text-xs text-neutral-500 line-through tabular-nums block">
                    {formatToman(service.price)}
                  </span>
                  <span className="text-xl font-black text-[#d4af37] tabular-nums">
                    {formatToman(service.discountPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-black text-white tabular-nums">
                  {formatToman(service.price)}
                </span>
              )}
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">توضیحات و فرآیند انجام خدمت:</h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white">مزایا و ویژگی‌های این خدمت:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Master Barbers Available */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white">آرایشگران ارائه‌دهنده این خدمت:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceBarbers.map((barber) => (
                <div
                  key={barber.id}
                  className="p-3 bg-[#14161d] border border-white/5 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{barber.name}</span>
                      <span className="text-[11px] text-neutral-400">{barber.title}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#d4af37] font-semibold tabular-nums">{toPersianDigits(barber.rating)} ★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Booking CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => navigate('booking', { serviceId: service.id })}
              className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e3bf4a] hover:to-[#c69f33] text-neutral-950 font-bold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>رزرو این خدمت در تقویم نوبت‌دهی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
