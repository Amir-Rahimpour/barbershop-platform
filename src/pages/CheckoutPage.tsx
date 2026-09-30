import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Building,
  ArrowRight
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    currentUser,
    createOrder,
    navigate
  } = useApp();

  const [customerName, setCustomerName] = useState(
    currentUser?.name ? `${currentUser.name} ${currentUser.lastName || ''}`.trim() : ''
  );
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState('تهران');
  const [shippingAddress, setShippingAddress] = useState(
    'تهران، خیابان ولیعصر، بالاتر از ظفر، پلاک ۲۵، واحد ۳'
  );
  const [postalCode, setPostalCode] = useState('1968814521');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card_to_card' | 'cash_on_delivery'>('online');
  const [orderComplete, setOrderComplete] = useState<any>(null);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    const calc = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    discountAmount = Math.min(calc, appliedCoupon.maxDiscountAmount);
  }

  const shippingFee = cartSubtotal > 1000000 ? 0 : 45000;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      return;
    }

    const order = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      city: city.trim(),
      shippingAddress: shippingAddress.trim(),
      paymentMethod
    });

    setOrderComplete(order);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-in zoom-in-90 duration-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">سفارش شما با موفقیت ثبت شد!</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            فاکتور و پیامک وضعیت ارسال به شماره {toPersianDigits(orderComplete.customerPhone)} فرستاده شد.
          </p>
        </div>

        {/* Invoice Card */}
        <div className="bg-[#14161d] border border-white/10 rounded-2xl p-6 text-right space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs text-neutral-400">شماره سفارش:</span>
            <span className="text-sm font-black text-[#d4af37] font-mono tracking-wider tabular-nums">
              {orderComplete.orderNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block">گیرنده:</span>
              <span className="text-white font-bold mt-1 block">{orderComplete.customerName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">کد رهگیری پستی:</span>
              <span className="text-white font-mono mt-1 block tabular-nums">{orderComplete.trackingCode}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">روش پرداخت:</span>
              <span className="text-white mt-1 block">
                {orderComplete.paymentMethod === 'online'
                  ? 'درگاه شاپرک (پرداخت موفق)'
                  : orderComplete.paymentMethod === 'card_to_card'
                  ? 'کارت به کارت'
                  : 'پرداخت در محل'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">مبلغ کل پرداختی:</span>
              <span className="text-[#d4af37] font-bold mt-1 block tabular-nums">
                {formatToman(orderComplete.totalAmount)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-xs text-neutral-400">
            <span>نشانی ارسال: </span>
            <span className="text-white">{orderComplete.shippingAddress}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('customer-dashboard', { dashboardTab: 'orders' })}
            className="px-6 py-3 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            مشاهده در سفارش‌های من
          </button>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
          >
            ادامه خرید از فروشگاه
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm text-neutral-400">سبد خرید شما خالی است. ابتدا کالایی اضافه فرمایید.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-[#d4af37] text-neutral-950 font-bold text-xs rounded-xl"
        >
          ورود به فروشگاه
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1">
          <Truck className="w-4 h-4" />
          <span>تکمیل نهایی خرید</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">اطلاعات ارسال و پرداخت سفارش</h1>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Shipping & Payment Options Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer Details */}
            <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                اطلاعات تحویل‌گیرنده
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">نام و نام خانوادگی تحویل‌گیرنده *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="علیرضا صادقی"
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                    />
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">شماره تماس همراه *</label>
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
              </div>
            </div>

            {/* Address */}
            <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                نشانی دقیق پستی و مقصد
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 mb-1.5 font-medium">استان و شهر مقصد *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1.5 font-medium">کد پستی ۱۰ رقمی</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#0d0e12] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] dir-ltr text-right tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">آدرس پستی کامل *</label>
                  <textarea
                    rows={2}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="خیابان، کوچه، پلاک، واحد..."
                    className="w-full bg-[#0d0e12] border border-white/10 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                انتخاب شیوه پرداخت
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'bg-[#181b22] border-[#d4af37] shadow-sm'
                      : 'bg-[#0e1014] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="accent-[#d4af37]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        درگاه پرداخت آنلاین شتابی (زرین‌پال / سامان)
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        پرداخت امن با کلیه کارت‌های عضو شبکه شتاب با رمز پویا
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#d4af37]" />
                </label>

                <label
                  onClick={() => setPaymentMethod('card_to_card')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card_to_card'
                      ? 'bg-[#181b22] border-[#d4af37] shadow-sm'
                      : 'bg-[#0e1014] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card_to_card'}
                      onChange={() => setPaymentMethod('card_to_card')}
                      className="accent-[#d4af37]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        انتقال کارت به کارت بانکی
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        واریز به شماره کارت سالن و ثبت شماره پیگیری
                      </span>
                    </div>
                  </div>
                  <Building className="w-5 h-5 text-neutral-400" />
                </label>

                <label
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-[#181b22] border-[#d4af37] shadow-sm'
                      : 'bg-[#0e1014] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="accent-[#d4af37]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        پرداخت در محل (تهران)
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        تسویه کارتخوان هنگام تحویل بسته توسط پیک
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-neutral-400" />
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                مرور اقلام سفارش ({toPersianDigits(cart.length)})
              </h3>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-white/5 text-neutral-400 flex items-center justify-center text-[10px] tabular-nums">
                        {toPersianDigits(item.quantity)}×
                      </span>
                      <span className="text-white truncate max-w-[160px]">{item.product.title}</span>
                    </div>
                    <span className="text-[#d4af37] font-bold tabular-nums">
                      {formatToman((item.product.discountPrice ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>مجموع کالاها:</span>
                  <span className="tabular-nums">{formatToman(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>تخفیف:</span>
                    <span className="tabular-nums">- {formatToman(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>هزینه ارسال:</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? 'رایگان' : formatToman(shippingFee)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white">مبلغ نهایی فاکتور:</span>
                <span className="text-base font-extrabold text-[#d4af37] tabular-nums">
                  {formatToman(finalTotal)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0be49] hover:to-[#c69f33] text-neutral-950 font-bold text-xs sm:text-sm rounded-xl shadow-xl transition-all"
              >
                ثبت نهایی سفارش و پرداخت
              </button>

              <div className="pt-2 text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>اتصال امن به سامانه یکپارچه پرداخت شاپرک</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
