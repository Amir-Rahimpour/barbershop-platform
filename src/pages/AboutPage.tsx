import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  Award,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const AboutPage: React.FC = () => {
  const { salonInfo, barbers, navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#d4af37]">
            <Award className="w-3.5 h-3.5" />
            <span>میراث اصیل و هنر مدرن پیرایش</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            درباره مجموعه تخصصی {salonInfo.name}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            مجموعه باربرشاپ رویال از سال ۱۳۹۲ با هدف احیای هنر کلاسیک پیرایش مردانه و ارائه خدمات مراقبت از پوست و استایل در بالاترین استانداردهای جهانی تاسیس گردید. ما باور داریم پیرایش تنها یک عمل روزمره نیست، بلکه آیینی برای بازآفرینی آرامش، اعتماد به نفس و وقار در سبک زندگی آقایان است.
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            در این مجموعه، هر مراجعه‌کننده پیش از شروع کار، از مشاوره اختصاصی چهره‌شناسی توسط مستر استایلیست‌ها بهره‌مند می‌شود. تمام ابزارها به شیوه بیمارستانی ضدعفونی شده و از باکیفیت‌ترین محصولات گیاهی و بدون عوارض اروپایی استفاده می‌گردد.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('booking')}
              className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>رزرو آنلاین نوبت</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl relative h-96">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80"
              alt="فضای داخلی سالن"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div>
                <span className="text-xs text-[#d4af37] font-semibold">محیط آرامش‌بخش و اختصاصی</span>
                <p className="text-sm font-bold text-white mt-1">طراحی شده برای آسایش و پرستیژ شما</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barbers Team */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs text-[#d4af37] font-semibold">استایلیست‌های مقیم</span>
          <h2 className="text-2xl font-bold text-white">تیم متخصص و اساتید باربرشاپ</h2>
          <p className="text-xs text-neutral-400">
            هنرمندانی که سال‌ها تجربه و مهارت بین‌المللی را برای درخشش چهره شما به کار می‌گیرند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4 text-center"
            >
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={b.avatar}
                  alt={b.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover border-2 border-[#d4af37]/40 shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{b.name}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{b.title}</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-neutral-400">
                  <span>سابقه: {toPersianDigits(b.experienceYears)} سال</span>
                  <span>·</span>
                  <span className="text-[#d4af37] font-bold tabular-nums">{toPersianDigits(b.rating)} ★</span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {b.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Values & Standards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">ضوابط بهداشت بیمارستانی</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            استفاده از اتوکلاو پزشکی، تعویض پک‌های اختصاصی تک‌نفره و ضدعفونی سطوح پس از هر مراجعه‌کننده.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">متریال ارگانیک و درجه‌یک</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            تامین انحصاری محصولات مراقبت از مو و پوست از برترین لابراتوارهای انگلستان و ایتالیا.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#14161d] border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">تضمین رضایت ۱۰۰٪ مشتری</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            در صورت هرگونه عدم رضایت از خروجی استایل، کارشناسان ما تا جلب کامل رضایت شما در کنارتان خواهند بود.
          </p>
        </div>
      </div>
    </div>
  );
};
