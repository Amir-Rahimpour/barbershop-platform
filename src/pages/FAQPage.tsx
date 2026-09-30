import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Calendar, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FAQPage: React.FC = () => {
  const { navigate } = useApp();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'فرآیند رزرو آنلاین چگونه است و آیا نیاز به پرداخت بیعانه وجود دارد؟',
      a: 'شما می‌توانید خدمت، آرایشگر و زمان آزاد مورد نظر را در سامانه انتخاب کنید. رزرو شما بلافاصله در سیستم ثبت و تایید می‌شود. تسویه هزینه به صورت حضوری در سالن و پس از اتمام خدمت انجام می‌پذیرد.'
    },
    {
      q: 'در صورت تاخیر یا نیاز به تغییر ساعت نوبت چه باید کرد؟',
      a: 'در صورتی که بیش از ۱۵ دقیقه تاخیر داشته باشید، جهت جلوگیری از تداخل نوبت سایر مراجعین، نوبت شما ممکن است به زمان دیگری موکول شود. شما می‌توانید تا ۳ ساعت قبل از موعد نوبت، از طریق بخش «نوبت‌های من» در داشبورد کاربری خود نوبت را لغو یا جابجا فرمایید.'
    },
    {
      q: 'پروتکل‌های بهداشتی سالن شامل چه مواردی است؟',
      a: 'کلیه ابزارهای فلزی (قیچی، شانه، تیغ) در دستگاه اتوکلاو پزشکی استریل شده و حوله‌ها و پیش‌بندها در بسته‌بندی تک‌نفره استریل در حضور شما گشوده می‌شود.'
    },
    {
      q: 'پکیج گریم داماد چند روز قبل از مراسم باید هماهنگ شود؟',
      a: 'توصیه می‌شود حداقل ۱ تا ۲ هفته قبل از روز مراسم، هماهنگی و جلسه تست اولیه پوست و مو را رزرو فرمایید تا برنامه دقیق برای روز مراسم تنظیم گردد.'
    },
    {
      q: 'نحوه ارسال سفارش‌های فروشگاه و مدت زمان تحویل چگونه است؟',
      a: 'سفارش‌های تهران با پیک اختصاصی در کمتر از ۲۴ ساعت کاری و سفارش‌های شهرستان‌ها از طریق پست پیشتاز ظرف ۲ الی ۳ روز کاری تحویل می‌گردد.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-white">پرسش‌های متداول مشتریان</h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          پاسخ به سوالات پرتکرار درباره نوبت‌دهی، بهداشت و خدمات سالن رویال
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-[#14161d] border border-white/10 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-[#d4af37] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#d4af37] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
        <p className="text-xs text-neutral-400">پاسخ پرسش خود را نیافتید؟</p>
        <button
          onClick={() => navigate('contact')}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10"
        >
          تماس با کارشناسان پشتیبانی
        </button>
      </div>
    </div>
  );
};
