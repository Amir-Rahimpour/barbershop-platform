import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Scissors,
  Users,
  ShoppingBag,
  TrendingUp,
  Settings,
  Plus,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';
import { AppointmentStatus, Service, Product, WorkingHour } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    services,
    addService,
    updateService,
    deleteService,
    barbers,
    updateBarberSchedule,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    salonInfo,
    updateSalonInfo,
    showToast
  } = useApp();

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'appointments' | 'services' | 'barbers' | 'products' | 'orders' | 'settings'
  >('overview');

  // Appointment Filter
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');

  // New Service Modal / Form state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(300000);
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServiceCategory, setNewServiceCategory] = useState('cat-hair');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // New Product Modal / Form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(400000);
  const [newProductStock, setNewProductStock] = useState(20);
  const [newProductCategory, setNewProductCategory] = useState('prod-cat-hair');
  const [newProductBrand, setNewProductBrand] = useState('Royal Grooming');

  // Salon settings form state
  const [settingsName, setSettingsName] = useState(salonInfo.name);
  const [settingsPhone, setSettingsPhone] = useState(salonInfo.phone);
  const [settingsAddress, setSettingsAddress] = useState(salonInfo.address);
  const [settingsWorkHours, setSettingsWorkHours] = useState(salonInfo.workHoursSummary);

  // KPIs
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const todayAppointments = appointments.filter((a) => a.status === 'confirmed');
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const totalCompletedAppointments = appointments.filter((a) => a.status === 'completed');
  const appointmentsRevenue = totalCompletedAppointments.reduce((sum, a) => sum + a.price, 0);

  // Filtered Appointments
  const filteredAppointments =
    appointmentFilter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === appointmentFilter);

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    addService({
      categoryId: newServiceCategory,
      categoryName: 'آرایش و پیرایش',
      name: newServiceName.trim(),
      description: newServiceDesc.trim() || 'خدمت اختصاصی پیرایش سالن رویال',
      durationMinutes: Number(newServiceDuration),
      price: Number(newServicePrice),
      benefits: ['خدمات تخصصی', 'متریال استاندارد'],
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      isActive: true,
      barberIds: ['barber-1', 'barber-2']
    });

    setIsAddingService(false);
    setNewServiceName('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductTitle.trim()) return;

    addProduct({
      categoryId: newProductCategory,
      categoryName: 'محصولات مراقبتی',
      title: newProductTitle.trim(),
      description: 'محصول ارگانیک و باکیفیت مراقبت از مو و پوست',
      price: Number(newProductPrice),
      stock: Number(newProductStock),
      isFeatured: false,
      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'],
      brand: newProductBrand.trim(),
      specifications: [{ key: 'کیفیت', value: 'درجه یک' }]
    });

    setIsAddingProduct(false);
    setNewProductTitle('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonInfo({
      name: settingsName,
      phone: settingsPhone,
      address: settingsAddress,
      workHoursSummary: settingsWorkHours
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>سامانه مدیریت جامع باربرشاپ رویال</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">داشبورد مدیریت و کنترل سیستم</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">تاریخ امروز:</span>
          <span className="px-3 py-1 bg-[#14161d] border border-white/10 rounded-xl text-xs font-bold text-white tabular-nums">
            {new Date().toLocaleDateString('fa-IR')}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'overview', label: 'میز کار و آمار', icon: LayoutDashboard },
          { id: 'appointments', label: `رزروها (${toPersianDigits(appointments.length)})`, icon: Calendar },
          { id: 'services', label: `خدمات و تعرفه‌ها (${toPersianDigits(services.length)})`, icon: Scissors },
          { id: 'barbers', label: `آرایشگران و شیفت‌ها (${toPersianDigits(barbers.length)})`, icon: Users },
          { id: 'products', label: `فروشگاه و انبار (${toPersianDigits(products.length)})`, icon: ShoppingBag },
          { id: 'orders', label: `سفارش‌ها (${toPersianDigits(orders.length)})`, icon: TrendingUp },
          { id: 'settings', label: 'تنظیمات سالن', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                currentTab === tab.id
                  ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {currentTab === 'overview' && (
        <div className="space-y-8">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>نوبت‌های فعال امروز</span>
                <Calendar className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="text-3xl font-extrabold text-white tabular-nums">
                {toPersianDigits(todayAppointments.length)}
              </p>
              <span className="text-[11px] text-emerald-400">نوبت‌های تایید شده در سالن</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>کل فروش فروشگاه</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-white tabular-nums">
                {formatToman(totalSales)}
              </p>
              <span className="text-[11px] text-neutral-400">{toPersianDigits(orders.length)} سفارش پرداخت شده</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>درآمد حاصل از رزروها</span>
                <Scissors className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-extrabold text-[#d4af37] tabular-nums">
                {formatToman(appointmentsRevenue)}
              </p>
              <span className="text-[11px] text-neutral-400">از نوبت‌های پایان‌یافته</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>آرایشگران فعال سالن</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white tabular-nums">
                {toPersianDigits(barbers.filter((b) => b.isActive).length)}
              </p>
              <span className="text-[11px] text-neutral-400">استایلیست‌های مقیم</span>
            </div>
          </div>

          {/* Revenue & Bookings Performance Chart Mockup */}
          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">روند فروش و رزروهای ۷ روز اخیر</h3>
                <span className="text-xs text-neutral-400">تحلیل تجمیعی نوبت‌های حضوری و فروش آنلاین</span>
              </div>
              <span className="text-xs font-bold text-[#d4af37]">رشد +۱۸٪ نسبت به هفته گذشته</span>
            </div>

            {/* Pure CSS Bar Visualizer */}
            <div className="grid grid-cols-7 gap-3 items-end h-44 pt-6 px-2 text-center text-xs">
              {[
                { day: 'شنبه', count: 12, height: '65%' },
                { day: 'یکشنبه', count: 15, height: '80%' },
                { day: 'دوشنبه', count: 10, height: '55%' },
                { day: 'سه‌شنبه', count: 18, height: '95%' },
                { day: 'چهارشنبه', count: 14, height: '75%' },
                { day: 'پنج‌شنبه', count: 20, height: '100%' },
                { day: 'جمعه', count: 8, height: '40%' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {toPersianDigits(item.count)} نوبت
                  </span>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-[#d4af37]/40 to-[#d4af37] rounded-t-lg transition-all group-hover:brightness-125"
                  />
                  <span className="text-[11px] text-neutral-400 whitespace-nowrap">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Appointments Preview */}
          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white">آخرین نوبت‌های ثبت‌شده در سیستم</h3>
              <button
                onClick={() => setCurrentTab('appointments')}
                className="text-xs text-[#d4af37] hover:underline"
              >
                مشاهده همه ({toPersianDigits(appointments.length)})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-neutral-500 border-b border-white/5">
                    <th className="pb-3">کد رزرو</th>
                    <th className="pb-3">مشتری</th>
                    <th className="pb-3">آرایشگر</th>
                    <th className="pb-3">خدمت</th>
                    <th className="pb-3">تاریخ و ساعت</th>
                    <th className="pb-3">مبلغ</th>
                    <th className="pb-3">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appointments.slice(0, 5).map((app) => (
                    <tr key={app.id} className="text-neutral-300 hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-bold text-white tabular-nums">{app.bookingCode}</td>
                      <td className="py-3">{app.customerName}</td>
                      <td className="py-3">{app.barberName}</td>
                      <td className="py-3">{app.serviceName}</td>
                      <td className="py-3 tabular-nums">{app.date} {toPersianDigits(app.startTime)}</td>
                      <td className="py-3 font-bold text-[#d4af37] tabular-nums">{formatToman(app.price)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : app.status === 'completed'
                              ? 'bg-blue-500/10 text-blue-400'
                              : app.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {app.status === 'confirmed' ? 'تأیید شده' : app.status === 'completed' ? 'تکمیل' : app.status === 'cancelled' ? 'لغو' : 'در انتظار'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Appointments Management */}
      {currentTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-white">مدیریت نوبت‌ها و رزرواسیون</h3>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">فیلتر وضعیت:</span>
              <select
                value={appointmentFilter}
                onChange={(e: any) => setAppointmentFilter(e.target.value)}
                className="bg-[#14161d] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">همه نوبت‌ها</option>
                <option value="confirmed">تأیید شده</option>
                <option value="pending">در انتظار تایید</option>
                <option value="completed">انجام شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>
          </div>

          <div className="bg-[#14161d] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/[0.02] text-neutral-400 border-b border-white/10">
                    <th className="p-4">کد پیگیری</th>
                    <th className="p-4">نام مشتری و تماس</th>
                    <th className="p-4">آرایشگر</th>
                    <th className="p-4">خدمت</th>
                    <th className="p-4">زمان مراجعه</th>
                    <th className="p-4">مبلغ خدمت</th>
                    <th className="p-4">وضعیت نوبت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] text-neutral-200">
                      <td className="p-4 font-mono font-bold text-white tabular-nums">{app.bookingCode}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{app.customerName}</span>
                        <span className="text-neutral-400 tabular-nums dir-ltr text-right block">{app.customerPhone}</span>
                      </td>
                      <td className="p-4">{app.barberName}</td>
                      <td className="p-4">{app.serviceName}</td>
                      <td className="p-4 tabular-nums">
                        {app.date} | {toPersianDigits(app.startTime)}
                      </td>
                      <td className="p-4 font-bold text-[#d4af37] tabular-nums">{formatToman(app.price)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : app.status === 'completed'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : app.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {app.status !== 'completed' && (
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'completed')}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[11px] transition-colors"
                              title="ثبت به عنوان انجام شده"
                            >
                              اتمام خدمت
                            </button>
                          )}
                          {app.status !== 'confirmed' && app.status !== 'completed' && (
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                              className="px-2 py-1 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] rounded-lg text-[11px] transition-colors"
                              title="تأیید نوبت"
                            >
                              تأیید
                            </button>
                          )}
                          {app.status !== 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[11px] transition-colors"
                              title="لغو نوبت"
                            >
                              لغو
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Services Management */}
      {currentTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">مدیریت خدمات، تعرفه‌ها و زمان‌ها</h3>
            <button
              onClick={() => setIsAddingService((prev) => !prev)}
              className="px-4 py-2 bg-[#d4af37] text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن خدمت جدید</span>
            </button>
          </div>

          {/* Add Service Drawer/Form */}
          {isAddingService && (
            <form onSubmit={handleSaveService} className="p-6 rounded-2xl bg-[#181b24] border border-[#d4af37]/40 space-y-4 text-xs animate-in zoom-in-95 duration-150">
              <h4 className="font-bold text-sm text-white">مشخصات خدمت جدید</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-neutral-300 block mb-1">نام خدمت *</label>
                  <input
                    type="text"
                    required
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="مثال: فیشیال طلا"
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">تعرفه (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">مدت زمان (دقیقه) *</label>
                  <input
                    type="number"
                    required
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">توضیحات فرآیند خدمت</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="px-4 py-2 bg-white/5 text-neutral-300 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#d4af37] text-neutral-950 font-bold rounded-xl shadow-md"
                >
                  ثبت خدمت
                </button>
              </div>
            </form>
          )}

          {/* Services List Table */}
          <div className="bg-[#14161d] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/[0.02] text-neutral-400 border-b border-white/10">
                    <th className="p-4">نام خدمت</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">مدت زمان</th>
                    <th className="p-4">قیمت مصوب</th>
                    <th className="p-4">امتیاز</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-white/[0.02] text-neutral-200">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{srv.name}</span>
                      </td>
                      <td className="p-4 text-neutral-400">{srv.categoryName}</td>
                      <td className="p-4 tabular-nums">{toPersianDigits(srv.durationMinutes)} دقیقه</td>
                      <td className="p-4 font-bold text-[#d4af37] tabular-nums">{formatToman(srv.price)}</td>
                      <td className="p-4 tabular-nums">{toPersianDigits(srv.rating)} ★</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteService(srv.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="حذف خدمت"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Barbers & Schedule */}
      {currentTab === 'barbers' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white">مدیریت آرایشگران، ساعات کاری و شیفت‌ها</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4"
              >
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37]/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{barber.name}</h4>
                    <p className="text-xs text-neutral-400">{barber.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <span>سابقه: {toPersianDigits(barber.experienceYears)} سال</span>
                      <span>·</span>
                      <span className="text-[#d4af37] tabular-nums">{toPersianDigits(barber.rating)} ★</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-white block">برنامه هفتگی کاری:</span>
                  <div className="space-y-1 text-neutral-300">
                    {barber.workingHours.map((wh) => (
                      <div key={wh.dayOfWeek} className="flex justify-between py-0.5 border-b border-white/[0.02]">
                        <span className="text-neutral-400">{wh.dayName}:</span>
                        <span className="tabular-nums">
                          {wh.isOpen
                            ? `${toPersianDigits(wh.startTime)} الی ${toPersianDigits(wh.endTime)}`
                            : 'تعطیل'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3 bg-white/5 rounded-xl text-xs text-neutral-300 flex items-center justify-between">
                    <span>زمان استراحت روزانه:</span>
                    <span className="tabular-nums font-bold text-[#d4af37]">۱۴:۰۰ الی ۱۵:۰۰</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Products & Inventory */}
      {currentTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">مدیریت محصولات، موجودی انبار و قیمت‌گذاری</h3>
            <button
              onClick={() => setIsAddingProduct((prev) => !prev)}
              className="px-4 py-2 bg-[#d4af37] text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن محصول جدید</span>
            </button>
          </div>

          {/* Add Product Form */}
          {isAddingProduct && (
            <form onSubmit={handleSaveProduct} className="p-6 rounded-2xl bg-[#181b24] border border-[#d4af37]/40 space-y-4 text-xs animate-in zoom-in-95 duration-150">
              <h4 className="font-bold text-sm text-white">مشخصات محصول جدید</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-neutral-300 block mb-1">نام محصول *</label>
                  <input
                    type="text"
                    required
                    value={newProductTitle}
                    onChange={(e) => setNewProductTitle(e.target.value)}
                    placeholder="مثال: روغن ریش آرگان"
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">برند</label>
                  <input
                    type="text"
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">قیمت (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1">تعداد موجودی انبار *</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 bg-white/5 text-neutral-300 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#d4af37] text-neutral-950 font-bold rounded-xl shadow-md"
                >
                  ثبت محصول
                </button>
              </div>
            </form>
          )}

          {/* Products Table */}
          <div className="bg-[#14161d] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/[0.02] text-neutral-400 border-b border-white/10">
                    <th className="p-4">محصول</th>
                    <th className="p-4">برند</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">قیمت فروش</th>
                    <th className="p-4">موجودی انبار</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-white/[0.02] text-neutral-200">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-contain bg-neutral-900 p-1"
                        />
                        <span className="truncate max-w-[200px]">{prod.title}</span>
                      </td>
                      <td className="p-4 text-neutral-400">{prod.brand}</td>
                      <td className="p-4 text-neutral-400">{prod.categoryName}</td>
                      <td className="p-4 font-bold text-[#d4af37] tabular-nums">{formatToman(prod.price)}</td>
                      <td className="p-4">
                        <span
                          className={`font-bold tabular-nums ${
                            prod.stock <= 5 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {toPersianDigits(prod.stock)} عدد
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="حذف کالا"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Orders Management */}
      {currentTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white">مدیریت سفارش‌ها و ارسال کالاها</h3>

          <div className="bg-[#14161d] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/[0.02] text-neutral-400 border-b border-white/10">
                    <th className="p-4">شماره سفارش</th>
                    <th className="p-4">مشتری</th>
                    <th className="p-4">آدرس ارسال</th>
                    <th className="p-4">تعداد اقلام</th>
                    <th className="p-4">مبلغ فاکتور</th>
                    <th className="p-4">وضعیت پرداخت</th>
                    <th className="p-4">کد رهگیری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/[0.02] text-neutral-200">
                      <td className="p-4 font-mono font-bold text-white tabular-nums">{ord.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{ord.customerName}</span>
                        <span className="text-neutral-400 tabular-nums dir-ltr text-right block">{ord.customerPhone}</span>
                      </td>
                      <td className="p-4 max-w-[200px] truncate text-neutral-300">{ord.shippingAddress}</td>
                      <td className="p-4 tabular-nums">{toPersianDigits(ord.items.length)} قلم کالا</td>
                      <td className="p-4 font-bold text-[#d4af37] tabular-nums">{formatToman(ord.totalAmount)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {ord.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار'}
                        </span>
                      </td>
                      <td className="p-4 font-mono tabular-nums text-neutral-400">{ord.trackingCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Salon Settings */}
      {currentTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-6 text-xs max-w-2xl">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
            تنظیمات عمومی سالن و نمایش سایت
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-neutral-300 block mb-1">نام رسمی سالن پیرایش</label>
              <input
                type="text"
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">شماره تلفن رزرو و پشتیبانی</label>
              <input
                type="text"
                value={settingsPhone}
                onChange={(e) => setSettingsPhone(e.target.value)}
                className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white dir-ltr text-right tabular-nums"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">خلاصه ساعات کاری برای نمایش در هدر و فوتر</label>
              <input
                type="text"
                value={settingsWorkHours}
                onChange={(e) => setSettingsWorkHours(e.target.value)}
                className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">نشانی کامل سالن</label>
              <textarea
                rows={2}
                value={settingsAddress}
                onChange={(e) => setSettingsAddress(e.target.value)}
                className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#d4af37] text-neutral-950 font-bold rounded-xl shadow-md"
          >
            ذخیره تنظیمات سالن
          </button>
        </form>
      )}
    </div>
  );
};
