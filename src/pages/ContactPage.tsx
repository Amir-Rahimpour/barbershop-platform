import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  MessageCircle,
  Instagram,
  CheckCircle2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { salonInfo, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSubmitted(true);
    showToast('پیام شما با موفقیت ارسال شد. کارشناسان با شما تماس خواهند گرفت.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
          <Phone className="w-4 h-4" />
          <span>ارتباط با مجموعه رویال</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">تماس با ما و موقعیت مکانی</h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          جهت هماهنگی رویدادهای خاص، گریم داماد یا مشاوره درباره خدمات، با کمال میل پاسخگوی شما هستیم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-5 text-xs">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
              اطلاعات تماس مستقیم
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">نشانی سالن مرکزی:</span>
                  <p className="text-neutral-400 mt-1 leading-relaxed">{salonInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">تلفن‌های رزرواسیون:</span>
                  <p className="text-neutral-300 mt-1 dir-ltr text-right font-mono tabular-nums">
                    {salonInfo.phone} · {salonInfo.phoneSecondary}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">ساعات کاری سالن:</span>
                  <p className="text-neutral-400 mt-1 leading-relaxed">{salonInfo.workHoursSummary}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">ایمیل رسمی:</span>
                  <p className="text-neutral-400 mt-1 dir-ltr text-right">{salonInfo.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <a
                href={`https://wa.me/${salonInfo.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساپ سالن</span>
              </a>
              <a
                href={`https://instagram.com/${salonInfo.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>اینستاگرام</span>
              </a>
            </div>
          </div>

          {/* Map View Visual Mockup */}
          <div className="relative h-56 rounded-2xl bg-[#14161d] border border-white/10 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#252836_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="relative z-10 text-center space-y-2 p-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37] text-neutral-950 flex items-center justify-center mx-auto shadow-lg shadow-[#d4af37]/30 animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">لوکیشن سعادت‌آباد - مجتمع رویال</p>
              <p className="text-[11px] text-neutral-400">دارای پارکینگ اختصاصی رایگان برای مراجعین VIP</p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-2xl bg-[#14161d] border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">ارسال پیام یا درخواست همکاری</h3>
              <p className="text-xs text-neutral-400 mt-1">
                فرم زیر را تکمیل فرمایید؛ پیام شما مستقیماً توسط مدیر داخلی سالن بررسی خواهد شد.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">پیام شما با موفقیت ثبت گردید</h4>
                <p className="text-xs text-neutral-300">
                  از اینکه با باربرشاپ رویال در تماس هستید سپاسگزاریم. به زودی با شما تماس می‌گیریم.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl"
                >
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1.5 font-medium">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="علیرضا حسینی"
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1.5 font-medium">شماره تلفن همراه *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1.5 font-medium">موضوع پیام</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: رزرو وقت برای مراسم عقد و دامادی"
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1.5 font-medium">متن پیام یا پرسش شما *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ارسال پیام به مدیریت</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
