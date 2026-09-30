import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const AuthPages: React.FC<{ mode: 'login' | 'register' | 'forgot' }> = ({ mode }) => {
  const { login, register, navigate, showToast } = useApp();

  // Common inputs
  const [phone, setPhone] = useState('09123456789');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('password');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    if (loginMethod === 'otp' && !isOtpSent) {
      setIsOtpSent(true);
      showToast('کد تایید ۵ رقمی تستی (۱۲۳۴۵) پیامک شد', 'info');
      return;
    }

    login(phone);
    navigate('customer-dashboard');
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (!isOtpSent) {
      setIsOtpSent(true);
      showToast('کد تایید فعال‌سازی برای شماره شما ارسال شد', 'info');
      return;
    }

    register(name.trim(), phone.trim(), email.trim() || undefined);
    navigate('customer-dashboard');
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    if (!isOtpSent) {
      setIsOtpSent(true);
      showToast('کد بازیابی حساب کاربری ارسال گردید', 'info');
      return;
    }

    showToast('رمز عبور شما با موفقیت بازنشانی شد', 'success');
    navigate('login');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa831c] p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
          <div className="w-full h-full bg-[#121419] rounded-[14px] flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#d4af37]" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-white">
          {mode === 'login'
            ? 'ورود به حساب کاربری'
            : mode === 'register'
            ? 'ثبت‌نام مشتری جدید'
            : 'بازیابی کلمه عبور'}
        </h1>
        <p className="text-xs text-neutral-400">
          {mode === 'login'
            ? 'جهت مشاهده نوبت‌ها و پیگیری سفارش‌ها وارد شوید'
            : mode === 'register'
            ? 'عضویت در باشگاه مشتریان باربرشاپ رویال'
            : 'شماره همراه خود را جهت دریافت کد بازیابی وارد فرمایید'}
        </p>
      </div>

      {/* Main Form Box */}
      <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 shadow-2xl space-y-5">
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Toggle OTP vs Password */}
            <div className="flex rounded-xl bg-[#0d0e12] p-1 border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setIsOtpSent(false);
                }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  loginMethod === 'password'
                    ? 'bg-[#d4af37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ورود با رمز عبور
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  loginMethod === 'otp'
                    ? 'bg-[#d4af37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ورود با کد پیامکی (OTP)
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-300 font-medium">شماره تلفن همراه</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {loginMethod === 'password' ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-medium">کلمه عبور</label>
                  <button
                    type="button"
                    onClick={() => navigate('forgot-password')}
                    className="text-[#d4af37] hover:underline text-[11px]"
                  >
                    فراموشی رمز؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-right"
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            ) : isOtpSent ? (
              <div className="space-y-1.5 text-xs">
                <label className="text-neutral-300 font-medium">کد تایید ۵ رقمی پیامک شده</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="۱۲۳۴۵"
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-center font-mono text-base tracking-widest tabular-nums"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-neutral-500">کد آزمایشی ارسال شده: ۱۲۳۴۵</p>
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0be49] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {loginMethod === 'otp' && !isOtpSent ? 'دریافت کد پیامکی' : 'ورود به حساب کاربری'}
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-300 font-medium">نام و نام خانوادگی *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: رضا امیری"
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-300 font-medium">شماره تلفن همراه *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-300 font-medium">آدرس ایمیل (اختیاری)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-right"
              />
            </div>

            {isOtpSent && (
              <div className="space-y-1.5 text-xs">
                <label className="text-neutral-300 font-medium">کد تایید پیامکی ارسال شده</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="۱۲۳۴۵"
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center tracking-widest tabular-nums focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0be49] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {!isOtpSent ? 'دریافت کد تایید و ثبت‌نام' : 'تکمیل عضویت در سایت'}
            </button>

            <p className="text-[10px] text-neutral-500 text-center leading-tight">
              ثبت‌نام عمومی منحصراً به عنوان حساب مشتری ایجاد می‌گردد. دسترسی پرسنل و مدیریت صرفاً از طریق پنل ادمین فعال می‌شود.
            </p>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-300 font-medium">شماره تلفن همراه ثبت‌شده</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {isOtpSent && (
              <div className="space-y-1.5 text-xs">
                <label className="text-neutral-300 font-medium">کد تایید ارسال شده</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="۱۲۳۴۵"
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center tracking-widest tabular-nums focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0be49] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {!isOtpSent ? 'ارسال کد بازیابی' : 'ثبت رمز عبور جدید'}
            </button>
          </form>
        )}

        {/* Footer switch */}
        <div className="pt-4 border-t border-white/5 text-center text-xs text-neutral-400">
          {mode === 'login' ? (
            <p>
              حساب کاربری ندارید؟{' '}
              <button
                onClick={() => navigate('register')}
                className="text-[#d4af37] font-semibold hover:underline"
              >
                ثبت‌نام کنید
              </button>
            </p>
          ) : (
            <p>
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <button
                onClick={() => navigate('login')}
                className="text-[#d4af37] font-semibold hover:underline"
              >
                وارد شوید
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Demo helper quick credentials */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400 space-y-2">
        <span className="font-semibold text-white block">حساب‌های تستی جهت بررسی سریع:</span>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <button
            onClick={() => {
              setPhone('09123456789');
              setPassword('123456');
            }}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-right truncate"
          >
            مشتری: علیرضا
          </button>
          <button
            onClick={() => {
              setPhone('09122222222');
              setPassword('123456');
            }}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-right truncate"
          >
            آرایشگر: سامان
          </button>
          <button
            onClick={() => {
              setPhone('09121111111');
              setPassword('123456');
            }}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-right truncate"
          >
            مدیر: محمدرضا
          </button>
        </div>
      </div>
    </div>
  );
};
