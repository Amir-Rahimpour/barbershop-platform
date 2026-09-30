import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scissors,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Send,
  MessageCircle,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { salonInfo, navigate, serviceCategories } = useApp();

  return (
    <footer className="bg-[#0b0c10] border-t border-white/10 text-neutral-400 text-sm">
      {/* Trust Highlights Section */}
      <div className="border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">بهداشت و استریل ۱۰۰٪</h4>
                <p className="text-xs text-neutral-400 mt-0.5">استفاده از پک‌های استریل یک‌بارمصرف و الکل بیمارستانی</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">استایلیست‌های بین‌المللی</h4>
                <p className="text-xs text-neutral-400 mt-0.5">دارای گواهینامه‌های رسمی پیرایش و هیرکات از آکادمی‌های معتبر</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">متریال و محصولات ارگانیک</h4>
                <p className="text-xs text-neutral-400 mt-0.5">استفاده اختصاصی از برندهای معتبر اروپایی بدون سولفات و پارابن</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">{salonInfo.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400">
              {salonInfo.slogan}. ما هنر اصیل پیرایش کلاسیک را با متدهای روز دنیا ترکیب کرده‌ایم تا هر حضور شما، تجربه‌ای آرامش‌بخش و شایسته باشد.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/${salonInfo.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://t.me/${salonInfo.telegram}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${salonInfo.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-[#d4af37] transition-colors">
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-[#d4af37] transition-colors">
                  لیست خدمات و تعرفه‌ها
                </button>
              </li>
              <li>
                <button onClick={() => navigate('booking')} className="hover:text-[#d4af37] transition-colors">
                  رزرو آنلاین وقت نوبت
                </button>
              </li>
              <li>
                <button onClick={() => navigate('available-appointments')} className="hover:text-[#d4af37] transition-colors">
                  نوبت‌های خالی نزدیک
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-[#d4af37] transition-colors">
                  فروشگاه محصولات مراقبتی
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-dashboard')} className="hover:text-[#d4af37] transition-colors">
                  ورود به پنل کاربری
                </button>
              </li>
            </ul>
          </div>

          {/* Services Category List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">خدمات تخصصی</h4>
            <ul className="space-y-2 text-xs">
              {serviceCategories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate('services')}
                    className="hover:text-[#d4af37] transition-colors text-right"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-[#d4af37] transition-colors">
                  سوالات متداول (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">اطلاعات تماس و نشانی</h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{salonInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${salonInfo.phone}`} className="dir-ltr text-right hover:text-[#d4af37] tabular-nums font-mono">
                  {salonInfo.phone}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{salonInfo.workHoursSummary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {salonInfo.name}. تمام حقوق مادی و معنوی محفوظ است.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('privacy')} className="hover:text-neutral-300 transition-colors">
              حریم خصوصی
            </button>
            <button onClick={() => navigate('terms')} className="hover:text-neutral-300 transition-colors">
              شرایط و قوانین رزرو
            </button>
            <button onClick={() => navigate('contact')} className="hover:text-neutral-300 transition-colors">
              پشتیبانی و تماس
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
