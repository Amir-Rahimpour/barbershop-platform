import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Scissors,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Phone,
  FileText
} from 'lucide-react';
import {
  formatToman,
  toPersianDigits,
  getUpcomingBookingDays,
  calculateAvailableSlots,
  DayOption
} from '../utils/persianDate';

export const BookingPage: React.FC = () => {
  const {
    services,
    barbers,
    appointments,
    currentUser,
    routeParams,
    createAppointment,
    navigate
  } = useApp();

  // Booking Flow Steps: 1: Service, 2: Barber, 3: Date & Slot, 4: Customer Details & Confirmation
  const [step, setStep] = useState<number>(1);

  // Selected state initialized with routeParams if passed
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    routeParams.serviceId || services[0]?.id || ''
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    routeParams.barberId || ''
  );

  const upcomingDays = useMemo(() => getUpcomingBookingDays(14), []);
  const [selectedDay, setSelectedDay] = useState<DayOption>(
    upcomingDays.find((d) => d.dateStr === routeParams.dateStr) || upcomingDays[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(
    routeParams.startTime ? { startTime: routeParams.startTime, endTime: '' } : null
  );

  // Customer Contact Info for final step
  const [customerName, setCustomerName] = useState(
    currentUser?.name ? `${currentUser.name} ${currentUser.lastName || ''}`.trim() : ''
  );
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');

  // Booking Success State
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Resolved entities
  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const eligibleBarbers = barbers.filter((b) =>
    selectedService?.barberIds ? selectedService.barberIds.includes(b.id) : true
  );

  // Default barber if none selected
  const activeBarber =
    barbers.find((b) => b.id === selectedBarberId) || eligibleBarbers[0] || barbers[0];

  // Dynamic available slot engine
  const availableSlots = useMemo(() => {
    if (!activeBarber || !selectedService || !selectedDay) return [];
    return calculateAvailableSlots(
      activeBarber,
      selectedService,
      selectedDay.dateStr,
      selectedDay.dayOfWeek,
      appointments
    );
  }, [activeBarber, selectedService, selectedDay, appointments]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot) return;
    if (!customerName.trim() || !customerPhone.trim()) return;

    const newApp = createAppointment({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      barberId: activeBarber.id,
      serviceId: selectedService.id,
      date: selectedDay.dateStr,
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime || '',
      notes: notes.trim() || undefined
    });

    setBookingSuccess(newApp);
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-in zoom-in-90 duration-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">نوبت شما با موفقیت ثبت شد!</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            پیامک تایید نوبت به شماره {toPersianDigits(bookingSuccess.customerPhone)} ارسال گردید.
          </p>
        </div>

        {/* Booking Card Voucher */}
        <div className="bg-[#14161d] border border-white/10 rounded-2xl p-6 text-right space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs text-neutral-400">کد پیگیری اختصاصی:</span>
            <span className="text-sm font-black text-[#d4af37] font-mono tracking-wider tabular-nums">
              {bookingSuccess.bookingCode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block">خدمت رزرو شده:</span>
              <span className="text-white font-bold mt-1 block">{bookingSuccess.serviceName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">آرایشگر:</span>
              <span className="text-white font-bold mt-1 block">{bookingSuccess.barberName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">تاریخ مراجعه:</span>
              <span className="text-white font-bold mt-1 block">{selectedDay.displayLabel}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">ساعت حضور:</span>
              <span className="text-[#d4af37] font-bold mt-1 block tabular-nums">
                {toPersianDigits(bookingSuccess.startTime)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-neutral-400">مبلغ قابل پرداخت در سالن:</span>
            <span className="text-base font-black text-white tabular-nums">
              {formatToman(bookingSuccess.price)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('customer-dashboard', { dashboardTab: 'appointments' })}
            className="px-6 py-3 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            مشاهده در نوبت‌های من
          </button>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1">
          <Calendar className="w-4 h-4" />
          <span>سامانه رزرواسیون برخط باربرشاپ رویال</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">رزرو آنلاین نوبت پیرایش</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          در ۴ مرحله ساده و بدون تداخل زمانی، زمان دلخواه خود را رزرو فرمایید.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs">
        <button
          onClick={() => setStep(1)}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border transition-all ${
            step === 1
              ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold'
              : step > 1
              ? 'bg-white/5 border-white/10 text-neutral-300'
              : 'bg-white/[0.02] border-white/5 text-neutral-500'
          }`}
        >
          <span className="block text-[9px] sm:text-[10px] text-neutral-400">۱. خدمت</span>
          <span className="truncate block">انتخاب خدمت</span>
        </button>

        <button
          onClick={() => setStep(2)}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border transition-all ${
            step === 2
              ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold'
              : step > 2
              ? 'bg-white/5 border-white/10 text-neutral-300'
              : 'bg-white/[0.02] border-white/5 text-neutral-500'
          }`}
        >
          <span className="block text-[9px] sm:text-[10px] text-neutral-400">۲. آرایشگر</span>
          <span className="truncate block">استایلیست</span>
        </button>

        <button
          onClick={() => setStep(3)}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border transition-all ${
            step === 3
              ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold'
              : step > 3
              ? 'bg-white/5 border-white/10 text-neutral-300'
              : 'bg-white/[0.02] border-white/5 text-neutral-500'
          }`}
        >
          <span className="block text-[9px] sm:text-[10px] text-neutral-400">۳. زمان</span>
          <span className="truncate block">روز و ساعت</span>
        </button>

        <button
          onClick={() => selectedTimeSlot && setStep(4)}
          disabled={!selectedTimeSlot}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border transition-all ${
            step === 4
              ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold'
              : 'bg-white/[0.02] border-white/5 text-neutral-500 disabled:opacity-40'
          }`}
        >
          <span className="block text-[9px] sm:text-[10px] text-neutral-400">۴. تأیید</span>
          <span className="truncate block">تأیید نهایی</span>
        </button>
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">لطفاً خدمت مورد نظر خود را انتخاب فرمایید:</h3>
            <span className="text-xs text-neutral-400">{toPersianDigits(services.length)} خدمت فعال</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setSelectedServiceId(srv.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                  selectedServiceId === srv.id
                    ? 'bg-[#181b22] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                    : 'bg-[#14161d] border-white/5 hover:border-white/20'
                }`}
              >
                <img
                  src={srv.image}
                  alt={srv.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                    {selectedServiceId === srv.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1">{srv.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{toPersianDigits(srv.durationMinutes)} دقیقه</span>
                    </span>
                    <span className="text-xs font-bold text-[#d4af37] tabular-nums">
                      {formatToman(srv.discountPrice ?? srv.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>مرحله بعد: انتخاب آرایشگر</span>
              <ArrowRight className="w-4 h-4 rtl-flip" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Barber */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              انتخاب آرایشگر برای خدمت «{selectedService.name}»:
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-[#d4af37] hover:underline"
            >
              تغییر خدمت
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eligibleBarbers.map((barber) => (
              <div
                key={barber.id}
                onClick={() => setSelectedBarberId(barber.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-center space-y-4 ${
                  activeBarber.id === barber.id
                    ? 'bg-[#181b22] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                    : 'bg-[#14161d] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative w-20 h-20 mx-auto">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover border-2 border-[#d4af37]/40"
                    />
                    {activeBarber.id === barber.id && (
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#d4af37] rounded-full text-neutral-950 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{barber.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{barber.title}</p>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {barber.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <span>سابقه: {toPersianDigits(barber.experienceYears)} سال</span>
                  <span className="text-[#d4af37] font-bold tabular-nums">{toPersianDigits(barber.rating)} ★</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
            >
              مرحله قبل
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>مرحله بعد: انتخاب تاریخ و ساعت</span>
              <ArrowRight className="w-4 h-4 rtl-flip" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Available Slot */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">انتخاب زمان و ساعت مراجعه</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                خدمت: <strong className="text-white">{selectedService.name}</strong> ({toPersianDigits(selectedService.durationMinutes)} دقیقه) | آرایشگر: <strong className="text-white">{activeBarber.name}</strong>
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-[#d4af37] hover:underline"
            >
              تغییر آرایشگر
            </button>
          </div>

          {/* 14 Upcoming Days Horizontal Bar */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400 block">انتخاب روز:</label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
              {upcomingDays.map((day) => (
                <button
                  key={day.dateStr}
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedTimeSlot(null);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[96px] p-3 rounded-2xl border transition-all text-center ${
                    selectedDay.dateStr === day.dateStr
                      ? 'bg-[#d4af37] text-neutral-950 border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-bold'
                      : 'bg-[#14161d] border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <span className="text-[11px] opacity-80">{day.relativeName || day.dayName}</span>
                  <span className="text-base font-extrabold my-0.5 tabular-nums">
                    {toPersianDigits(day.dateStr.split('-')[2])}
                  </span>
                  <span className="text-[10px] opacity-80">{day.dayName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slots Matrix */}
          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white">
                زمان‌های آزاد در تاریخ {selectedDay.displayLabel}:
              </span>
              <span className="text-xs text-neutral-400">
                گام‌های زمانی بر اساس مدت خدمت ({toPersianDigits(selectedService.durationMinutes)} دقیقه)
              </span>
            </div>

            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
                {availableSlots.map((slot, index) => {
                  const isSelected = selectedTimeSlot?.startTime === slot.startTime;
                  return (
                    <button
                      key={index}
                      disabled={!slot.isAvailable}
                      onClick={() =>
                        setSelectedTimeSlot({
                          startTime: slot.startTime,
                          endTime: slot.endTime
                        })
                      }
                      title={slot.conflictReason}
                      className={`p-3 min-h-[50px] rounded-xl border text-center transition-all ${
                        !slot.isAvailable
                          ? 'bg-white/[0.02] border-white/5 text-neutral-600 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#d4af37] border-[#d4af37] text-neutral-950 font-black shadow-md'
                          : 'bg-white/5 border-white/10 hover:border-[#d4af37]/60 text-white font-medium hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs block tabular-nums">
                        {toPersianDigits(slot.startTime)}
                      </span>
                      <span className="text-[10px] opacity-70 block tabular-nums">
                        تا {toPersianDigits(slot.endTime)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-semibold text-white">
                  در این روز هیچ زمان آزادی برای این آرایشگر یافت نشد.
                </p>
                <p className="text-xs text-neutral-400">
                  ممکن است این روز تعطیل رسمی باشد یا کلیه نوبت‌ها تکمیل شده باشد. روز دیگری را برگزینید.
                </p>
              </div>
            )}

            {/* Slots Legend */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white/10 border border-white/20" />
                <span>قابل رزرو</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#d4af37]" />
                <span>انتخاب شما</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-neutral-800 line-through opacity-50" />
                <span>رزرو شده / غیرفعال</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
            >
              مرحله قبل
            </button>
            <button
              disabled={!selectedTimeSlot}
              onClick={() => setStep(4)}
              className="px-8 py-3 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <span>مرحله بعد: تایید و تکمیل اطلاعات</span>
              <ArrowRight className="w-4 h-4 rtl-flip" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Summary & Customer Information */}
      {step === 4 && (
        <form onSubmit={handleConfirmBooking} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">خلاصه رزرو و مشخصات مراجعه‌کننده</h3>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-[#d4af37] hover:underline"
            >
              ویرایش زمان
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Summary Card */}
            <div className="md:col-span-5 bg-[#14161d] border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                اطلاعات نوبت انتخابی
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">خدمت:</span>
                  <span className="text-white font-bold">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">آرایشگر:</span>
                  <span className="text-white font-bold">{activeBarber.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">تاریخ مراجعه:</span>
                  <span className="text-[#d4af37] font-bold">{selectedDay.displayLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ساعت حضور:</span>
                  <span className="text-[#d4af37] font-bold tabular-nums">
                    {toPersianDigits(selectedTimeSlot?.startTime || '')} الی {toPersianDigits(selectedTimeSlot?.endTime || '')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">مدت تخمینی:</span>
                  <span className="text-white tabular-nums">{toPersianDigits(selectedService.durationMinutes)} دقیقه</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-neutral-400">مبلغ قابل تسویه در سالن:</span>
                <span className="text-base font-extrabold text-[#d4af37] tabular-nums">
                  {formatToman(selectedService.discountPrice ?? selectedService.price)}
                </span>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="md:col-span-7 bg-[#14161d] border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                اطلاعات تماس مراجعه‌کننده
              </h4>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">
                    نام و نام خانوادگی <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: علیرضا حسینی"
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                    />
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">
                    شماره تلفن همراه (جهت ارسال پیامک نوبت) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums"
                    />
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">
                    توضیحات یا مدل مدنظر شما (اختیاری)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اگر نکته خاصی در مورد مو، حساسیت پوستی یا مدل مد نظرتان دارید بنویسید..."
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
                >
                  مرحله قبل
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e3bf4a] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-xl transition-all"
                >
                  تأیید نهایی و ثبت نوبت
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
