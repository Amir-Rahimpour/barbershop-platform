import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  LogOut,
  Edit3,
  Scissors,
  Award,
  Truck,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  ChevronLeft,
  Trash2,
  Plus,
  Sparkles,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Navigation,
  Camera,
  Package
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';
import { Appointment, Order } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    appointments,
    orders,
    favorites,
    products,
    services,
    cancelAppointment,
    notifications,
    markNotificationAsRead,
    logout,
    routeParams,
    navigate,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(
    routeParams.dashboardTab || 'overview'
  );

  // Profile editing form state
  const [profileName, setProfileName] = useState(currentUser?.name || 'علیرضا');
  const [profileLastName, setProfileLastName] = useState(currentUser?.lastName || 'صادقی');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'alireza@gmail.com');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '09123456789');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');
  const [hairType, setHairType] = useState('صاف و متراکم (ضخامت متوسط)');
  const [skinSensitivities, setSkinSensitivities] = useState('حساسیت خفیف به تیغ سنتی در ناحیه زیر گلو');
  const [favoriteStylistNote, setFavoriteStylistNote] = useState('فید کلاسیک لایت با حفظ حجم موهای بالا و خط ریش آنکادر طبیعی');

  // Address book management state
  const [addressList, setAddressList] = useState([
    {
      id: 'addr-1',
      title: 'منزل شخصی',
      city: 'تهران',
      postalCode: '۱۹۶۸۸۱۴۵۲۱',
      address: 'سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۱۲، زنگ ۴',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'دفتر کار',
      city: 'تهران',
      postalCode: '۱۹۱۷۸۴۵۳۱۰',
      address: 'جردن، بالاتر از میرداماد، برج نگین، طبقه ۵، واحد ۵۰۲',
      isDefault: false
    }
  ]);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressTitle, setNewAddressTitle] = useState('');
  const [newAddressCity, setNewAddressCity] = useState('تهران');
  const [newAddressPostalCode, setNewAddressPostalCode] = useState('');
  const [newAddressText, setNewAddressText] = useState('');

  // Selected Order for Modal Invoice
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Cancel Appointment Confirmation Modal State
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Tracking code copy feedback
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  // Filter appointments for current customer
  const myAppointments = appointments.filter(
    (a) => a.customerId === currentUser?.id || a.customerPhone === currentUser?.phone
  );

  // Active / Upcoming appointments (confirmed or pending)
  const activeAppointments = myAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  // Past / History appointments
  const historyAppointments = myAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  // Customer Orders
  const myOrders = orders.filter(
    (o) => o.customerId === currentUser?.id || o.customerPhone === currentUser?.phone
  );

  // Favorite products and services
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const favoriteServices = services.filter((s) => favorites.includes(s.id));

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      name: profileName.trim(),
      lastName: profileLastName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar: avatarUrl.trim() || currentUser.avatar
    });

    showToast('اطلاعات کاربری و ترجیحات شما با موفقیت به‌روزرسانی شد.', 'success');
  };

  // Handle Add New Address
  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressTitle.trim() || !newAddressText.trim()) return;

    const newAddr = {
      id: 'addr-' + Date.now(),
      title: newAddressTitle.trim(),
      city: newAddressCity.trim(),
      postalCode: newAddressPostalCode.trim() || '---',
      address: newAddressText.trim(),
      isDefault: addressList.length === 0
    };

    setAddressList((prev) => [...prev, newAddr]);
    setIsAddingAddress(false);
    setNewAddressTitle('');
    setNewAddressPostalCode('');
    setNewAddressText('');
    showToast('نشانی جدید به دفترچه آدرس‌های شما اضافه شد.', 'success');
  };

  // Set Address as Default
  const handleSetDefaultAddress = (id: string) => {
    setAddressList((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    );
    showToast('نشانی پیش‌فرض تغییر یافت.', 'info');
  };

  // Delete Address
  const handleDeleteAddress = (id: string) => {
    setAddressList((prev) => prev.filter((a) => a.id !== id));
    showToast('نشانی حذف گردید.', 'info');
  };

  // Execute Appointment Cancellation
  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;
    cancelAppointment(appointmentToCancel.id);
    setAppointmentToCancel(null);
  };

  // Copy tracking number to clipboard
  const handleCopyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTrackingId(code);
    showToast(`کد رهگیری پستی ${code} کپی شد.`, 'success');
    setTimeout(() => {
      setCopiedTrackingId(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* 1. Header Profile Banner */}
      <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171a22] via-[#1a1d26] to-[#121419] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#d4af37]/30">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center text-center sm:text-right gap-4 sm:gap-5 relative z-10">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#c29c2d] to-[#8d6b17] p-0.5 shadow-xl shadow-[#d4af37]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#121419] rounded-[14px] flex items-center justify-center text-2xl font-black text-[#d4af37] overflow-hidden">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.name ? currentUser.name.charAt(0) : 'ک'
                )}
              </div>
            </div>
            <span className="absolute -bottom-1 -left-1 px-2 py-0.5 rounded-full bg-[#d4af37] text-neutral-950 font-black text-[10px] shadow-sm flex items-center gap-0.5 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>VIP</span>
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentUser?.name || 'کاربر گرامی'} {currentUser?.lastName || ''}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>حساب تایید شده</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 tabular-nums dir-ltr sm:text-right">
              {currentUser?.phone} {currentUser?.email ? `· ${currentUser.email}` : ''}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-neutral-300">
              <span className="text-[#d4af37] font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>باشگاه رویال:</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/15 text-[#d4af37] font-bold tabular-nums">
                ۲۴۰ امتیاز
              </span>
              <span className="text-neutral-500 hidden sm:inline">·</span>
              <span className="text-emerald-400 font-medium text-[11px] sm:text-xs">
                ۵٪ تخفیف دائمی روی کلیه خدمات حضوری
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 w-full md:w-auto">
          <button
            onClick={() => navigate('booking')}
            className="flex-1 md:flex-initial min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e2be4a] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>رزرو وقت جدید</span>
          </button>
          <button
            onClick={logout}
            className="min-h-[44px] px-4 py-2.5 bg-white/5 hover:bg-rose-500/10 text-neutral-300 hover:text-rose-400 font-medium text-xs rounded-xl border border-white/10 hover:border-rose-500/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
            title="خروج از حساب کاربری"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>

      {/* 2. Responsive Mobile Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10 text-xs snap-x touch-pan-x">
        <button
          onClick={() => setActiveTab('overview')}
          className={`min-h-[42px] px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start active:scale-95 ${
            activeTab === 'overview'
              ? 'bg-[#d4af37] text-neutral-950 shadow-md shadow-[#d4af37]/25'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>میز کاربری (خلاصه وضعیت)</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`min-h-[42px] px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start active:scale-95 ${
            activeTab === 'appointments'
              ? 'bg-[#d4af37] text-neutral-950 shadow-md shadow-[#d4af37]/25'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>نوبت‌های من</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
            activeTab === 'appointments' ? 'bg-neutral-950 text-[#d4af37]' : 'bg-white/10 text-neutral-300'
          }`}>
            {toPersianDigits(myAppointments.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`min-h-[42px] px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start active:scale-95 ${
            activeTab === 'orders'
              ? 'bg-[#d4af37] text-neutral-950 shadow-md shadow-[#d4af37]/25'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>سفارش‌های فروشگاه</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
            activeTab === 'orders' ? 'bg-neutral-950 text-[#d4af37]' : 'bg-white/10 text-neutral-300'
          }`}>
            {toPersianDigits(myOrders.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`min-h-[42px] px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start active:scale-95 ${
            activeTab === 'profile'
              ? 'bg-[#d4af37] text-neutral-950 shadow-md shadow-[#d4af37]/25'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>ویرایش اطلاعات و نشانی‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`min-h-[42px] px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start active:scale-95 ${
            activeTab === 'favorites'
              ? 'bg-[#d4af37] text-neutral-950 shadow-md shadow-[#d4af37]/25'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>علاقه‌مندی‌ها</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
            activeTab === 'favorites' ? 'bg-neutral-950 text-[#d4af37]' : 'bg-white/10 text-neutral-300'
          }`}>
            {toPersianDigits(favorites.length)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`min-h-[42px] px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start active:scale-95 ${
            activeTab === 'notifications'
              ? 'bg-[#d4af37] text-neutral-950 shadow-md shadow-[#d4af37]/25'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>اعلان‌ها</span>
          {notifications.some(n => !n.isRead) && (
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          )}
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-fade-in-soft">
          {/* Section A: Active Appointments Cards with Dynamic Hover and Smooth Transitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm sm:text-base font-black">کارت‌های وضعیت نوبت‌های فعال ({toPersianDigits(activeAppointments.length)})</span>
              </div>
              <button
                onClick={() => navigate('booking')}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold group"
              >
                <span>رزرو نوبت جدید</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl-flip transition-transform group-hover:-translate-x-1" />
              </button>
            </div>

            {activeAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {activeAppointments.map((app, index) => (
                  <div
                    key={app.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="group relative p-5 sm:p-6 rounded-3xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/80 hover:shadow-2xl hover:shadow-[#d4af37]/15 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between space-y-5 overflow-hidden"
                  >
                    {/* Ambient subtle top glowing highlight on hover */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl group-hover:bg-[#d4af37]/15 transition-all duration-500 pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                      {/* Top Bar inside card */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-xs font-black text-white">نوبت حضوری فعال</span>
                          <span className="text-[11px] text-neutral-400 font-mono tabular-nums px-2 py-0.5 rounded bg-white/5">
                            کد {app.bookingCode}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20'
                          }`}
                        >
                          {app.status === 'confirmed' ? 'تأیید شده و قطعی' : 'در انتظار تأیید'}
                        </span>
                      </div>

                      {/* Barber and Service row */}
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10 group-hover:border-[#d4af37]/40 transition-colors">
                          <img
                            src={app.barberAvatar}
                            alt={app.barberName}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 sm:w-18 sm:h-18 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#d4af37] transition-colors truncate">
                            {app.serviceName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                            <Scissors className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>استایلیست تخصصی:</span>
                            <strong className="text-white font-bold">{app.barberName}</strong>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-400">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            <span>مدت زمان پیش‌بینی‌شده:</span>
                            <span className="font-bold text-neutral-200 tabular-nums">
                              {toPersianDigits(app.serviceDuration)} دقیقه
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Time & Date Highlight Box */}
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e1014] border border-white/5 group-hover:border-[#d4af37]/20 flex items-center justify-between text-xs transition-colors">
                        <div className="space-y-1">
                          <span className="text-[11px] text-neutral-400 block font-medium">تاریخ رزرو نوبت:</span>
                          <span className="font-black text-white text-xs sm:text-sm">{app.date}</span>
                        </div>
                        <div className="text-left space-y-1">
                          <span className="text-[11px] text-neutral-400 block font-medium">ساعت حضور:</span>
                          <span className="text-base sm:text-lg font-black text-[#d4af37] tabular-nums block">
                            ساعت {toPersianDigits(app.startTime)}
                          </span>
                        </div>
                      </div>

                      {app.notes && (
                        <div className="text-xs text-neutral-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[#d4af37] font-semibold">یادداشت شما: </span>
                          <span>{app.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
                      <div>
                        <span className="text-neutral-500 text-[11px] block">مبلغ تسویه حضوری:</span>
                        <span className="text-base font-black text-white tabular-nums">
                          {formatToman(app.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setAppointmentToCancel(app)}
                          className="flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 font-bold rounded-xl text-xs transition-all duration-200 active:scale-95 border border-rose-500/20"
                        >
                          لغو نوبت
                        </button>
                        <button
                          onClick={() => navigate('contact')}
                          className="flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-200 font-semibold rounded-xl text-xs transition-all duration-200 active:scale-95 border border-white/10 flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>تماس با سالن</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-10 rounded-3xl bg-[#14161d] border border-white/5 text-center space-y-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">در حال حاضر هیچ نوبت فعالی ثبت نشده است</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                  جهت جلوگیری از معطلی و رزرو بهترین ساعت کاری با استایلیست مدنظرتان، هم‌اکنون وقت خود را انتخاب فرمایید.
                </p>
                <button
                  onClick={() => navigate('booking')}
                  className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e2be4a] hover:to-[#c69f33] text-neutral-950 font-black text-xs rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-200 active:scale-95"
                >
                  رزرو اولین نوبت آنلاین
                </button>
              </div>
            )}
          </div>

          {/* Section B: Latest Shop Orders with Hover Effects and Status Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm sm:text-base font-black">آخرین سفارش‌های فروشگاه ({toPersianDigits(myOrders.length)})</span>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold group"
              >
                <span>مشاهده آرشیو کامل</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl-flip transition-transform group-hover:-translate-x-1" />
              </button>
            </div>

            {myOrders.length > 0 ? (
              <div className="space-y-4">
                {myOrders.slice(0, 3).map((ord, idx) => (
                  <div
                    key={ord.id}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    className="group p-5 sm:p-6 rounded-3xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/10 hover:-translate-y-1 transition-all duration-300 ease-out space-y-4 relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-sm sm:text-base font-black text-white font-mono">
                          فاکتور {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {ord.status === 'delivered' ? 'تحویل داده شده' : 'در حال پردازش و ارسال پستی'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                        <span>ثبت: {ord.createdAt}</span>
                        {ord.trackingCode && (
                          <>
                            <span>·</span>
                            <button
                              onClick={() => ord.trackingCode && handleCopyTrackingCode(ord.trackingCode)}
                              className="flex items-center gap-1 text-neutral-300 hover:text-[#d4af37] font-mono transition-colors"
                              title="کپی کد رهگیری"
                            >
                              <span>رهگیری: {ord.trackingCode}</span>
                              {copiedTrackingId === ord.trackingCode ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-neutral-500" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress tracking indicator */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-neutral-400">
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-white font-semibold">ثبت سفارش</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-white font-semibold">تأیید سالن</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-white font-semibold">بسته‌بندی</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`h-1.5 rounded-full ${ord.status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500/80 animate-pulse'}`} />
                          <span className={ord.status === 'delivered' ? 'text-white font-semibold' : 'text-amber-400 font-semibold'}>
                            {ord.status === 'delivered' ? 'تحویل شد' : 'در مسیر ارسال'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {ord.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-[#0e1014] border border-white/5 text-xs text-neutral-200 hover:border-white/20 transition-colors"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-6 h-6 rounded-md object-contain bg-neutral-900"
                          />
                          <span className="truncate max-w-[150px] font-medium">{item.product.title}</span>
                          <span className="text-[#d4af37] font-bold tabular-nums">×{toPersianDigits(item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">مبلغ کل پرداختی:</span>
                        <span className="text-base font-black text-[#d4af37] tabular-nums">
                          {formatToman(ord.totalAmount)}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedInvoice(ord)}
                        className="min-h-[38px] px-4 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 font-bold"
                      >
                        <FileText className="w-4 h-4" />
                        <span>مشاهده و چاپ فاکتور رسمی</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-10 rounded-3xl bg-[#14161d] border border-white/5 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-500 mx-auto" />
                <p className="text-sm font-semibold text-white">تاکنون سفارشی از فروشگاه آنلاین ثبت نکرده‌اید</p>
                <button
                  onClick={() => navigate('shop')}
                  className="px-5 py-2.5 bg-[#d4af37] text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
                >
                  ورود به فروشگاه محصولات مراقبت آقایان
                </button>
              </div>
            )}
          </div>

          {/* Section C: Quick Profile Summary & Default Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="p-6 rounded-3xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#d4af37]" />
                  <span>اطلاعات پروفایل کاربری</span>
                </span>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ویرایش جزئیات</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>نام و نام خانوادگی:</span>
                  <span className="text-white font-bold">{profileName} {profileLastName}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>تلفن تماس:</span>
                  <span className="text-white font-mono dir-ltr tabular-nums">{profilePhone}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>ایمیل:</span>
                  <span className="text-white font-mono dir-ltr">{profileEmail}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>بافت مو و ترجیح:</span>
                  <span className="text-neutral-200">{hairType}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>نشانی پیش‌فرض تحویل کالا</span>
                </span>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs text-[#d4af37] hover:underline font-semibold"
                >
                  مدیریت آدرس‌ها
                </button>
              </div>

              {addressList.length > 0 ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{addressList[0].title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-semibold text-[10px]">
                      پیش‌فرض
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{addressList[0].address}</p>
                  <span className="text-[11px] text-neutral-500 font-mono block tabular-nums">
                    کد پستی: {addressList[0].postalCode}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-neutral-500">هیچ نشانی پستی ثبت نشده است.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MY APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-fade-in-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">کلیه نوبت‌های رزرو شده شما</h3>
              <p className="text-xs text-neutral-400 mt-1">
                لیست نوبت‌های فعال، انجام‌شده و لغوشده به تفکیک استایلیست، خدمت و ساعت مراجعه
              </p>
            </div>
            <button
              onClick={() => navigate('booking')}
              className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e2be4a] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>رزرو وقت جدید</span>
            </button>
          </div>

          {myAppointments.length > 0 ? (
            <div className="space-y-4">
              {myAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-sm sm:text-base font-bold text-white">{app.serviceName}</h4>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : app.status === 'completed'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : app.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {app.status === 'confirmed'
                          ? 'تأیید شده'
                          : app.status === 'completed'
                          ? 'انجام شده'
                          : app.status === 'cancelled'
                          ? 'لغو شده'
                          : 'در انتظار'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400">
                      استایلیست: <strong className="text-neutral-200">{app.barberName}</strong> · کد رزرو: <span className="font-mono text-neutral-300 tabular-nums">{app.bookingCode}</span> · مدت زمان: {toPersianDigits(app.serviceDuration)} دقیقه
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 text-xs">
                    <div className="text-right">
                      <span className="text-neutral-500 block text-[11px]">تاریخ و ساعت:</span>
                      <span className="text-[#d4af37] font-bold tabular-nums">
                        {app.date} | ساعت {toPersianDigits(app.startTime)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-neutral-500 block text-[11px]">تعرفه خدمت:</span>
                      <span className="text-white font-bold tabular-nums">
                        {formatToman(app.price)}
                      </span>
                    </div>

                    {app.status === 'confirmed' && (
                      <button
                        onClick={() => setAppointmentToCancel(app)}
                        className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 rounded-xl text-xs font-bold transition-all active:scale-95 border border-rose-500/20"
                      >
                        لغو نوبت
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#14161d] border border-white/5 rounded-3xl space-y-3">
              <Calendar className="w-10 h-10 text-neutral-500 mx-auto" />
              <p className="text-sm font-semibold text-white">هیچ نوبتی در آرشیو ثبت نشده است</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">سفارش‌های فروشگاه شما</h3>
              <p className="text-xs text-neutral-400 mt-1">
                سوابق خریدهای ثبت شده، رهگیری مرسولات پستی و صدور فاکتور رسمی
              </p>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="min-h-[44px] px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <span>خرید محصول جدید</span>
            </button>
          </div>

          {myOrders.length > 0 ? (
            <div className="space-y-4">
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 hover:-translate-y-1 transition-all duration-300 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm sm:text-base font-black text-white font-mono">
                        سفارش {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {ord.status === 'delivered' ? 'تحویل داده شده' : 'در حال پردازش و ارسال پستی'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>تاریخ: {ord.createdAt}</span>
                      <span>·</span>
                      <span>رهگیری: <strong className="text-white font-mono">{ord.trackingCode}</strong></span>
                    </div>
                  </div>

                  {/* Itemized List */}
                  <div className="divide-y divide-white/5">
                    {ord.items.map((item, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-xl object-contain bg-neutral-900 p-1"
                          />
                          <div>
                            <span className="font-bold text-white block">{item.product.title}</span>
                            <span className="text-neutral-400 text-[11px]">
                              {item.product.brand} · تعداد: {toPersianDigits(item.quantity)} عدد
                            </span>
                          </div>
                        </div>

                        <span className="font-bold text-white tabular-nums">
                          {formatToman((item.product.discountPrice ?? item.product.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-neutral-400">
                      <span>نشانی پستی مقصد: </span>
                      <span className="text-white">{ord.shippingAddress}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <div className="text-left">
                        <span className="text-neutral-500 block text-[11px]">مبلغ کل:</span>
                        <span className="text-base font-black text-[#d4af37] tabular-nums">
                          {formatToman(ord.totalAmount)}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedInvoice(ord)}
                        className="min-h-[38px] px-4 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] rounded-xl font-bold transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        <span>فاکتور رسمی</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#14161d] border border-white/5 rounded-3xl space-y-2">
              <ShoppingBag className="w-10 h-10 text-neutral-500 mx-auto" />
              <p className="text-sm font-semibold text-white">سفارشی ثبت نگردیده است</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: PROFILE & ADDRESSES EDITING */}
      {activeTab === 'profile' && (
        <div className="space-y-8 animate-fade-in-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Form 1: Edit Profile Information */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSaveProfile} className="p-5 sm:p-8 rounded-3xl bg-[#14161d] border border-white/10 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#d4af37]" />
                    <span>ویرایش اطلاعات حساب کاربری</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    نام، شماره تماس، ایمیل و ترجیحات استایلینگ خود را به‌روزرسانی فرمایید.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-neutral-300 block mb-1.5 font-medium">نام *</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1.5 font-medium">نام خانوادگی *</label>
                    <input
                      type="text"
                      required
                      value={profileLastName}
                      onChange={(e) => setProfileLastName(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1.5 font-medium">شماره تلفن همراه (پیامک نوبت) *</label>
                    <input
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1.5 font-medium">آدرس ایمیل</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] dir-ltr text-right transition-colors"
                    />
                  </div>
                </div>

                {/* Styling Preferences */}
                <div className="space-y-4 pt-4 border-t border-white/5 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-[#d4af37]" />
                    <span>ترجیحات تخصصی پوست و مو (راهنمای آرایشگر شما)</span>
                  </h4>

                  <div>
                    <label className="text-neutral-400 block mb-1">نوع مو و بافت سر</label>
                    <input
                      type="text"
                      value={hairType}
                      onChange={(e) => setHairType(e.target.value)}
                      placeholder="مثال: لخت، فر، کم‌پشت، ضخیم..."
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">حساسیت‌های پوستی یا آلرژی به تیغ/الکل</label>
                    <input
                      type="text"
                      value={skinSensitivities}
                      onChange={(e) => setSkinSensitivities(e.target.value)}
                      placeholder="مثال: حساسیت به الکل بعد از اصلاح یا تیغ در زیر گردن..."
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">استایل ریش و هیرکات مورد علاقه</label>
                    <input
                      type="text"
                      value={favoriteStylistNote}
                      onChange={(e) => setFavoriteStylistNote(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e2be4a] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95"
                  >
                    ذخیره تغییرات حساب کاربری
                  </button>
                </div>
              </form>
            </div>

            {/* Form 2: Manage Addresses */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 sm:p-8 rounded-3xl bg-[#14161d] border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#d4af37]" />
                      <span>دفترچه نشانی‌های تحویل</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">آدرس‌های ثبت‌شده جهت تسویه حساب سریع فروشگاه</p>
                  </div>

                  <button
                    onClick={() => setIsAddingAddress((prev) => !prev)}
                    className="min-h-[38px] px-3.5 py-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                </div>

                {/* Add Address Form Drawer */}
                {isAddingAddress && (
                  <form onSubmit={handleCreateAddress} className="p-4 rounded-2xl bg-[#0e1014] border border-[#d4af37]/30 space-y-3.5 text-xs animate-fade-in-soft">
                    <h4 className="font-bold text-white">ثبت نشانی جدید</h4>

                    <div>
                      <label className="text-neutral-400 block mb-1">عنوان نشانی (مثلاً منزل، محل کار)</label>
                      <input
                        type="text"
                        required
                        value={newAddressTitle}
                        onChange={(e) => setNewAddressTitle(e.target.value)}
                        placeholder="منزل"
                        className="w-full bg-[#14161d] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-neutral-400 block mb-1">شهر</label>
                        <input
                          type="text"
                          required
                          value={newAddressCity}
                          onChange={(e) => setNewAddressCity(e.target.value)}
                          className="w-full bg-[#14161d] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">کد پستی</label>
                        <input
                          type="text"
                          value={newAddressPostalCode}
                          onChange={(e) => setNewAddressPostalCode(e.target.value)}
                          placeholder="۱۰ رقم"
                          className="w-full bg-[#14161d] border border-white/10 rounded-xl p-2.5 text-white font-mono dir-ltr text-right focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">نشانی کامل پستی</label>
                      <textarea
                        rows={2}
                        required
                        value={newAddressText}
                        onChange={(e) => setNewAddressText(e.target.value)}
                        placeholder="خیابان، کوچه، پلاک، واحد..."
                        className="w-full bg-[#14161d] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="min-h-[38px] px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-colors"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="min-h-[38px] px-4 py-1.5 bg-[#d4af37] text-neutral-950 font-bold rounded-xl shadow-md transition-transform active:scale-95"
                      >
                        ثبت آدرس
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards List */}
                <div className="space-y-3">
                  {addressList.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2.5 transition-all duration-300 ${
                        addr.isDefault
                          ? 'bg-[#181b24] border-[#d4af37]/50 shadow-sm'
                          : 'bg-[#0d0e12] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#d4af37]" />
                          <span>{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              پیش‌فرض
                            </span>
                          )}
                        </span>

                        <div className="flex items-center gap-2">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] text-[#d4af37] hover:underline font-semibold"
                            >
                              انتخاب به عنوان پیش‌فرض
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                            title="حذف نشانی"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-neutral-300 leading-relaxed">{addr.address}</p>
                      <p className="text-[11px] text-neutral-500 tabular-nums">
                        شهر: {addr.city} · کد پستی: <span className="font-mono">{addr.postalCode}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-8 animate-fade-in-soft">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">اقلام نشان‌شده و مورد علاقه شما</h3>
            <p className="text-xs text-neutral-400 mt-1">
              دسترسی سریع به خدمات و محصولاتی که نشان کرده‌اید
            </p>
          </div>

          {favoriteProducts.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-neutral-400">محصولات منتخب:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate('product-detail', { productId: p.id })}
                    className="p-4 rounded-2xl bg-[#14161d] border border-white/5 hover:border-[#d4af37]/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 flex items-center gap-3.5"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-contain bg-neutral-900 p-1.5 shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="text-[10px] text-neutral-400">{p.brand}</span>
                      <h5 className="text-xs font-bold text-white line-clamp-1">{p.title}</h5>
                      <span className="text-xs font-bold text-[#d4af37] tabular-nums block">
                        {formatToman(p.discountPrice ?? p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favoriteServices.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold text-neutral-400">خدمات منتخب:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteServices.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate('service-detail', { serviceId: s.id })}
                    className="p-4 rounded-2xl bg-[#14161d] border border-white/5 hover:border-[#d4af37]/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{s.name}</h5>
                        <span className="text-[11px] text-neutral-400 tabular-nums">
                          {toPersianDigits(s.durationMinutes)} دقیقه
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#d4af37] tabular-nums">
                      {formatToman(s.discountPrice ?? s.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favoriteProducts.length === 0 && favoriteServices.length === 0 && (
            <div className="text-center py-16 bg-[#14161d] border border-white/5 rounded-3xl text-xs text-neutral-400">
              هنوز کالایی به لیست علاقه‌مندی‌ها اضافه نشده است.
            </div>
          )}
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4 animate-fade-in-soft">
          <h3 className="text-base sm:text-lg font-black text-white">اعلان‌ها و یادآوری‌های سیستمی</h3>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start justify-between gap-4 ${
                  n.isRead
                    ? 'bg-[#14161d] border-white/5 opacity-75'
                    : 'bg-[#181b24] border-[#d4af37]/50 shadow-md shadow-[#d4af37]/5'
                }`}
              >
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#d4af37]" />}
                    <span>{n.title}</span>
                  </h4>
                  <p className="text-neutral-300 leading-relaxed">{n.message}</p>
                </div>
                <span className="text-[10px] text-neutral-500 whitespace-nowrap">{n.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: APPOINTMENT CANCELLATION CONFIRMATION */}
      {appointmentToCancel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#14161d] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-xs animate-fade-in-soft">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">آیا از لغو این نوبت اطمینان دارید؟</h3>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              شما در حال لغو نوبت <strong>{appointmentToCancel.serviceName}</strong> نزد <strong>{appointmentToCancel.barberName}</strong> در تاریخ {appointmentToCancel.date} ساعت {toPersianDigits(appointmentToCancel.startTime)} هستید. در صورت انصراف، این بازه زمانی برای سایر متقاضیان آزاد خواهد شد.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setAppointmentToCancel(null)}
                className="min-h-[40px] px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-colors"
              >
                انصراف و حفظ نوبت
              </button>
              <button
                onClick={handleConfirmCancel}
                className="min-h-[40px] px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
              >
                تأیید لغو نوبت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVOICE VIEWER */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-[#14161d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs animate-fade-in-soft my-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <span className="font-black text-sm sm:text-base text-white">فاکتور رسمی فروش {selectedInvoice.orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-neutral-300">
              <div>
                <span className="text-neutral-500 block text-[11px]">تحویل‌گیرنده:</span>
                <span className="text-white font-bold">{selectedInvoice.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">شماره تماس:</span>
                <span className="text-white tabular-nums dir-ltr text-right block">{selectedInvoice.customerPhone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">کد رهگیری پستی:</span>
                <span className="text-white font-mono">{selectedInvoice.trackingCode}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">روش پرداخت:</span>
                <span className="text-white">درگاه الکترونیک شتابی (شاپرک)</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-neutral-500 block text-[11px]">نشانی پستی تحویل:</span>
              <p className="text-white leading-relaxed">{selectedInvoice.shippingAddress}</p>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="font-bold text-white block">اقلام سفارش:</span>
              {selectedInvoice.items.map((it: any) => (
                <div key={it.product.id} className="flex justify-between text-neutral-300 py-1.5 border-b border-white/[0.03]">
                  <span>{it.product.title} ({toPersianDigits(it.quantity)} عدد)</span>
                  <span className="text-white tabular-nums font-bold">
                    {formatToman((it.product.discountPrice ?? it.product.price) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between font-bold text-sm sm:text-base text-[#d4af37]">
              <span>مبلغ کل پرداخت شده:</span>
              <span className="tabular-nums">{formatToman(selectedInvoice.totalAmount)}</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-colors"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-[#d4af37] text-neutral-950 font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ فاکتور رسمی</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
