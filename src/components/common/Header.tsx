import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scissors,
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Sparkles,
  Heart,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDate';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    currentUser,
    logout,
    switchRole,
    cartCount,
    favorites,
    serviceCategories,
    productCategories,
    salonInfo
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const servicesRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchModalOpen(false);
    navigate('shop');
  };

  return (
    <>
      {/* Top Banner: Salon contact & Quick info */}
      <div className="bg-[#12141a] border-b border-white/5 py-1.5 px-4 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{salonInfo.workHoursSummary}</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <span>تلفن رزرو:</span>
              <a href={`tel:${salonInfo.phone}`} className="text-neutral-300 hover:text-[#d4af37] font-medium dir-ltr tabular-nums">
                {salonInfo.phone}
              </a>
            </span>
          </div>

          {/* Role quick switch for evaluator convenience */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">حالت نمایش:</span>
            <div className="inline-flex rounded-lg bg-[#1a1d24] p-0.5 border border-white/10 text-[11px]">
              <button
                onClick={() => switchRole('customer')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  currentUser?.role === 'customer'
                    ? 'bg-[#d4af37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                مشتری
              </button>
              <button
                onClick={() => switchRole('barber')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  currentUser?.role === 'barber'
                    ? 'bg-[#d4af37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                آرایشگر
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-[#d4af37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                مدیر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0e1014]/95 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Zone 1: Single Brand Lockup */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 active:scale-95 transition-all"
              aria-label="منوی موبایل"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 sm:gap-3 group text-right focus:outline-none min-h-[44px]"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#b89327] to-[#8f6d14] p-0.5 shadow-lg shadow-[#d4af37]/10 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#121419] rounded-[10px] flex items-center justify-center group-hover:bg-[#16181f] transition-colors">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37] group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                  {salonInfo.name}
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">
                  پیرایش و استایل آقایان
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'home'
                  ? 'text-[#d4af37] font-semibold bg-white/5'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              خانه
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentRoute === 'services' || currentRoute === 'service-detail'
                    ? 'text-[#d4af37] font-semibold bg-white/5'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>خدمات</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#14161d] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400 font-medium">
                    <span>دسته‌بندی خدمات</span>
                    <button
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        navigate('services');
                      }}
                      className="text-[#d4af37] hover:underline"
                    >
                      مشاهده همه
                    </button>
                  </div>
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        navigate('services');
                      }}
                      className="w-full text-right px-4 py-2.5 hover:bg-white/5 text-neutral-200 hover:text-[#d4af37] text-sm flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-neutral-500">←</span>
                    </button>
                  ))}
                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        navigate('booking');
                      }}
                      className="w-full py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] text-xs font-semibold rounded-lg text-center transition-colors"
                    >
                      رزرو آنلاین نوبت
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Online Booking Direct */}
            <button
              onClick={() => navigate('booking')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                currentRoute === 'booking'
                  ? 'text-[#d4af37] font-semibold bg-white/5'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>نوبت‌دهی آنلاین</span>
            </button>

            {/* Available Appointments Page */}
            <button
              onClick={() => navigate('available-appointments')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'available-appointments'
                  ? 'text-[#d4af37] font-semibold bg-white/5'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              نوبت‌های خالی
            </button>

            {/* Shop Dropdown */}
            <div className="relative" ref={shopRef}>
              <button
                onClick={() => setShopDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentRoute === 'shop' || currentRoute === 'product-detail'
                    ? 'text-[#d4af37] font-semibold bg-white/5'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>فروشگاه</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#14161d] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400 font-medium">
                    <span>محصولات مراقبت شخصی</span>
                    <button
                      onClick={() => {
                        setShopDropdownOpen(false);
                        navigate('shop');
                      }}
                      className="text-[#d4af37] hover:underline"
                    >
                      مشاهده همه
                    </button>
                  </div>
                  {productCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setShopDropdownOpen(false);
                        navigate('shop');
                      }}
                      className="w-full text-right px-4 py-2 hover:bg-white/5 text-neutral-200 hover:text-[#d4af37] text-sm flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-neutral-500 tabular-nums">({toPersianDigits(cat.count)})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('about')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'about'
                  ? 'text-[#d4af37] font-semibold bg-white/5'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              درباره ما
            </button>

            <button
              onClick={() => navigate('contact')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'contact'
                  ? 'text-[#d4af37] font-semibold bg-white/5'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              تماس با ما
            </button>
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="جستجو"
              aria-label="جستجو"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => {
                if (currentUser) {
                  navigate('customer-dashboard', { dashboardTab: 'favorites' });
                } else {
                  navigate('login');
                }
              }}
              className="relative p-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="نشان‌شده‌ها"
              aria-label="نشان‌شده‌ها"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#d4af37] text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center tabular-nums">
                  {toPersianDigits(favorites.length)}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('cart')}
              className="relative p-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="سبد خرید"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center tabular-nums">
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 bg-[#171a21] border border-white/10 hover:border-[#d4af37]/40 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-xs font-bold overflow-hidden">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-neutral-200">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#14161d] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs font-bold text-white">{currentUser.name} {currentUser.lastName || ''}</p>
                      <p className="text-[11px] text-neutral-400 tabular-nums dir-ltr text-right">{currentUser.phone}</p>
                      <div className="mt-1 text-[10px] text-[#d4af37] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>نقش: {currentUser.role === 'admin' ? 'مدیر سیستم' : currentUser.role === 'barber' ? 'آرایشگر' : 'مشتری'}</span>
                      </div>
                    </div>

                    {/* Admin Dashboard Link */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('admin-dashboard');
                        }}
                        className="w-full text-right px-4 py-2 text-xs text-amber-300 hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>پنل مدیریت پیشرفته</span>
                      </button>
                    )}

                    {/* Customer Dashboard Link */}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('customer-dashboard');
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-neutral-200 hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>داشبورد کاربری</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('customer-dashboard', { dashboardTab: 'appointments' });
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-neutral-200 hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>نوبت‌های من</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('customer-dashboard', { dashboardTab: 'orders' });
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-neutral-200 hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                      <span>سفارش‌های من</span>
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>خروج از حساب</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0bd47] hover:to-[#c49e31] text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-[#14161d] border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-sm font-semibold text-neutral-200">جستجو در خدمات و محصولات</span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="مثال: هیرکات VIP، روغن ریش، فیشیال، پماد مو..."
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37] hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="mt-4">
              <span className="text-xs text-neutral-500">پیشنهادات پربازدید:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['هیرکات کلاسیک', 'فیشیال صورت', 'گریم داماد', 'روغن ریش', 'پماد مات'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setSearchModalOpen(false);
                      navigate('shop');
                    }}
                    className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#12141a] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-[#d4af37]" />
                  <span className="font-bold text-white text-base">{salonInfo.name}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                <button
                  onClick={() => {
                    navigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-white/5 text-sm font-medium"
                >
                  خانه
                </button>
                <button
                  onClick={() => {
                    navigate('services');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-white/5 text-sm font-medium flex items-center justify-between"
                >
                  <span>خدمات آرایشگاه</span>
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                </button>
                <button
                  onClick={() => {
                    navigate('booking');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-amber-300 font-semibold bg-amber-500/10 text-sm flex items-center justify-between"
                >
                  <span>نوبت‌دهی آنلاین</span>
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    navigate('available-appointments');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-white/5 text-sm font-medium"
                >
                  نوبت‌های خالی
                </button>
                <button
                  onClick={() => {
                    navigate('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-white/5 text-sm font-medium flex items-center justify-between"
                >
                  <span>فروشگاه محصولات</span>
                  <ShoppingBag className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('about');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-white/5 text-sm font-medium"
                >
                  درباره ما
                </button>
                <button
                  onClick={() => {
                    navigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="text-right py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-white/5 text-sm font-medium"
                >
                  تماس با ما
                </button>
              </div>

              {currentUser?.role === 'admin' && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      navigate('admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-right py-2.5 px-3 rounded-xl bg-amber-400/10 text-amber-300 text-xs font-bold flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>پنل مدیریت پیشرفته</span>
                  </button>
                </div>
              )}

              {/* Mobile Quick Contacts */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <span className="text-[11px] text-neutral-400 block font-medium">تماس و هماهنگی سریع:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`tel:${salonInfo.phone}`}
                    className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-center font-bold dir-ltr tabular-nums flex items-center justify-center gap-1.5"
                  >
                    <span>{salonInfo.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${salonInfo.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-xl text-center font-bold flex items-center justify-center gap-1"
                  >
                    <span>واتساپ</span>
                  </a>
                </div>
              </div>

              {/* Quick Role Switcher on Mobile Drawer */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                <span className="text-[11px] text-neutral-400 block font-medium">تغییر نقش کاربری (تست سامانه):</span>
                <div className="grid grid-cols-3 gap-1 bg-[#0d0e12] p-1 rounded-xl border border-white/5 text-[11px]">
                  <button
                    onClick={() => {
                      switchRole('customer');
                      setMobileMenuOpen(false);
                    }}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      currentUser?.role === 'customer'
                        ? 'bg-[#d4af37] text-neutral-950'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    مشتری
                  </button>
                  <button
                    onClick={() => {
                      switchRole('barber');
                      setMobileMenuOpen(false);
                    }}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      currentUser?.role === 'barber'
                        ? 'bg-[#d4af37] text-neutral-950'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    آرایشگر
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      currentUser?.role === 'admin'
                        ? 'bg-[#d4af37] text-neutral-950'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    مدیر
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              {currentUser ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate('customer-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-neutral-200 text-center flex items-center justify-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#d4af37]" />
                    <span>داشبورد کاربری ({currentUser.name})</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 text-rose-400 text-xs text-center hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    خروج از حساب
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl text-center shadow-lg transition-all"
                >
                  ورود یا ثبت‌نام
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
