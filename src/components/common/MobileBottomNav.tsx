import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Calendar,
  Clock,
  ShoppingBag,
  User as UserIcon,
  LayoutDashboard
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDate';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, navigate, cartCount, currentUser } = useApp();

  return (
    <nav
      aria-label="منوی دسترسی سریع موبایل"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0c0d12]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => navigate('home')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            currentRoute === 'home'
              ? 'text-[#d4af37] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">خانه</span>
        </button>

        {/* 2. Services / Available slots */}
        <button
          onClick={() => navigate('available-appointments')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            currentRoute === 'available-appointments'
              ? 'text-[#d4af37] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">زمان‌های آزاد</span>
        </button>

        {/* 3. Center Highlight: Booking CTA */}
        <button
          onClick={() => navigate('booking')}
          className="min-h-[48px] flex flex-col items-center justify-center relative -mt-3 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#b89327] via-[#d4af37] to-[#f5d77f] p-0.5 shadow-lg shadow-[#d4af37]/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#12141a] rounded-[14px] flex items-center justify-center text-[#d4af37] hover:bg-[#161822]">
              <Calendar className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#d4af37] mt-1">رزرو نوبت</span>
        </button>

        {/* 4. Shop */}
        <button
          onClick={() => navigate('shop')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 relative transition-all active:scale-95 ${
            currentRoute === 'shop' || currentRoute === 'product-detail' || currentRoute === 'cart'
              ? 'text-[#d4af37] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-emerald-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center tabular-nums">
                {toPersianDigits(cartCount)}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">فروشگاه</span>
        </button>

        {/* 5. Dashboard / Account */}
        <button
          onClick={() => {
            if (currentUser?.role === 'admin') {
              navigate('admin-dashboard');
            } else if (currentUser) {
              navigate('customer-dashboard');
            } else {
              navigate('login');
            }
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            currentRoute === 'customer-dashboard' || currentRoute === 'admin-dashboard' || currentRoute === 'login' || currentRoute === 'register'
              ? 'text-[#d4af37] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {currentUser?.role === 'admin' ? (
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
          <span className="text-[10px] tracking-tight">
            {currentUser ? (currentUser.role === 'admin' ? 'مدیریت' : 'حساب من') : 'ورود'}
          </span>
        </button>
      </div>
    </nav>
  );
};
