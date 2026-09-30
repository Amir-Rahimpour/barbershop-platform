import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Filter,
  Scissors,
  User,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import {
  formatToman,
  toPersianDigits,
  getUpcomingBookingDays,
  calculateAvailableSlots,
  DayOption
} from '../utils/persianDate';

export const AvailableAppointmentsPage: React.FC = () => {
  const { services, barbers, appointments, navigate } = useApp();

  const upcomingDays = useMemo(() => getUpcomingBookingDays(14), []);

  const [selectedDate, setSelectedDate] = useState<string>(upcomingDays[0]?.dateStr || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');

  const currentDayOption =
    upcomingDays.find((d) => d.dateStr === selectedDate) || upcomingDays[0];

  // Barbers to inspect
  const targetBarbers =
    selectedBarberId === 'all'
      ? barbers
      : barbers.filter((b) => b.id === selectedBarberId);

  // Services to inspect
  const targetServices =
    selectedServiceId === 'all'
      ? services
      : services.filter((s) => s.id === selectedServiceId);

  // Compute all available slots across combinations for selected date
  const aggregatedSlots = useMemo(() => {
    if (!currentDayOption) return [];

    const list: {
      barber: (typeof barbers)[0];
      service: (typeof services)[0];
      startTime: string;
      endTime: string;
      dateStr: string;
      dayLabel: string;
    }[] = [];

    targetBarbers.forEach((barber) => {
      // Pick first matched service or each target service
      targetServices.forEach((service) => {
        // Check if barber provides this service
        if (service.barberIds && !service.barberIds.includes(barber.id)) {
          return;
        }

        const calculated = calculateAvailableSlots(
          barber,
          service,
          currentDayOption.dateStr,
          currentDayOption.dayOfWeek,
          appointments
        );

        calculated
          .filter((s) => s.isAvailable)
          .forEach((slot) => {
            list.push({
              barber,
              service,
              startTime: slot.startTime,
              endTime: slot.endTime,
              dateStr: currentDayOption.dateStr,
              dayLabel: currentDayOption.displayLabel
            });
          });
      });
    });

    // Sort by startTime
    return list.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [currentDayOption, targetBarbers, targetServices, appointments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
          <Calendar className="w-4 h-4" />
          <span>جدول زمان‌بندی آزاد سالن</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">نوبت‌های خالی و در دسترس</h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          مشاهده کلیه زمان‌های آزاد آرایشگران به همراه فیلتر دقیق بر اساس تاریخ، خدمت و استایلیست.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#14161d] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-white/5 pb-3">
          <Filter className="w-4 h-4 text-[#d4af37]" />
          <span>فیلتر زمان‌های آزاد</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Date Filter */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium">تاریخ موردنظر:</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#d4af37]"
            >
              {upcomingDays.map((d) => (
                <option key={d.dateStr} value={d.dateStr}>
                  {d.displayLabel} {d.relativeName ? `(${d.relativeName})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Barber Filter */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium">آرایشگر:</label>
            <select
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">همه آرایشگران</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.title})
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium">خدمت:</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">همه خدمات</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({toPersianDigits(s.durationMinutes)} دقیقه)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Current Day */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>
          نمایش زمان‌های آزاد برای <strong>{currentDayOption?.displayLabel}</strong>
        </span>
        <span>
          تعداد زمان‌های یافت شده: <strong className="text-white">{toPersianDigits(aggregatedSlots.length)} نوبت</strong>
        </span>
      </div>

      {/* Slots Grid */}
      {aggregatedSlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aggregatedSlots.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-base font-extrabold text-white tabular-nums">
                      {toPersianDigits(item.startTime)} الی {toPersianDigits(item.endTime)}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    آزاد
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="text-neutral-400">خدمت:</span>
                    <span className="font-semibold text-white">{item.service.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="text-neutral-400">آرایشگر:</span>
                    <span className="font-semibold text-white">{item.barber.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="text-neutral-400">تعرفه:</span>
                    <span className="font-bold text-[#d4af37] tabular-nums">
                      {formatToman(item.service.discountPrice ?? item.service.price)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate('booking', {
                    serviceId: item.service.id,
                    barberId: item.barber.id,
                    dateStr: item.dateStr,
                    startTime: item.startTime
                  })
                }
                className="w-full py-2.5 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>رزرو این زمان</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl-flip" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#14161d] border border-white/5 rounded-2xl space-y-3">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">هیچ نوبت خالی با شرایط انتخابی یافت نشد</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            لطفاً تاریخ دیگری را انتخاب کنید یا فیلترهای آرایشگر و خدمت را تغییر دهید.
          </p>
        </div>
      )}
    </div>
  );
};
