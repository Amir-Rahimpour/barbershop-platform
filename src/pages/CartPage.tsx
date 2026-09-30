import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    const calc = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    discountAmount = Math.min(calc, appliedCoupon.maxDiscountAmount);
  }

  const shippingFee = cartSubtotal > 1000000 ? 0 : 45000;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">سبد خرید شما خالی است</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            محصولات بهداشتی، مراقبت از ریش و حالت‌دهنده‌های باکیفیت ما را در فروشگاه بررسی کنید.
          </p>
        </div>
        <button
          onClick={() => navigate('shop')}
          className="px-8 py-3.5 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
        >
          <span>مشاهده محصولات فروشگاه</span>
          <ArrowLeft className="w-4 h-4 rtl-flip" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1">
          <ShoppingBag className="w-4 h-4" />
          <span>سبد خرید شما</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">اقلام انتخابی و تسویه حساب</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const unitPrice = item.product.discountPrice ?? item.product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="p-5 rounded-2xl bg-[#14161d] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-contain bg-neutral-900 p-2 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400">{item.product.brand}</span>
                    <h3
                      onClick={() => navigate('product-detail', { productId: item.product.id })}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#d4af37] cursor-pointer transition-colors"
                    >
                      {item.product.title}
                    </h3>
                    <div className="text-xs text-neutral-400 tabular-nums">
                      قیمت واحد: {formatToman(unitPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#0d0e12] border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-neutral-400"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                      {toPersianDigits(item.quantity)}
                    </span>
                    <button
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-neutral-400 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total item price */}
                  <div className="text-left min-w-[100px]">
                    <span className="text-xs font-bold text-white tabular-nums block">
                      {formatToman(itemTotal)}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="حذف از سبد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate('shop')}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← ادامه خرید و مشاهده سایر محصولات
            </button>
          </div>
        </div>

        {/* Right Column: Pricing & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Input Card */}
          <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Tag className="w-4 h-4 text-[#d4af37]" />
              <span>کد تخفیف دارید؟</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-400 block">کد {appliedCoupon.code} اعمال شد</span>
                  <span className="text-[11px] text-emerald-300">({toPersianDigits(appliedCoupon.discountPercent)}٪ تخفیف ویژه)</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-400 hover:underline"
                >
                  حذف
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="کد تخفیف: BARBER20"
                    className="flex-1 bg-[#0d0e12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    ثبت
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
                <p className="text-[10px] text-neutral-500">کدهای فعال تستی: BARBER20 , FIRST10</p>
              </form>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="p-6 rounded-2xl bg-[#14161d] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
              خلاصه هزینه فاکتور
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>جمع کل اقلام:</span>
                <span className="text-white tabular-nums">{formatToman(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>تخفیف کوپن:</span>
                  <span className="tabular-nums">- {formatToman(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400">رایگان</strong>
                  ) : (
                    formatToman(shippingFee)
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-[10px] text-neutral-500 leading-tight">
                  ارسال سفارش‌های بالای ۱٬۰۰۰٬۰۰۰ تومان رایگان می‌باشد.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-white">مبلغ نهایی پرداخت:</span>
              <span className="text-base font-extrabold text-[#d4af37] tabular-nums">
                {formatToman(finalTotal)}
              </span>
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89327] hover:from-[#e0be49] hover:to-[#c69f33] text-neutral-950 font-bold text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>ادامه فرآیند خرید و پرداخت</span>
              <ArrowLeft className="w-4 h-4 rtl-flip" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
