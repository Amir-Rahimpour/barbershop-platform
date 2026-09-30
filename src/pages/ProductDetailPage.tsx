import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ArrowRight
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';

export const ProductDetailPage: React.FC = () => {
  const { products, routeParams, addToCart, toggleFavorite, isFavorite, navigate } = useApp();

  const product =
    products.find((p) => p.id === routeParams.productId) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <button
        onClick={() => navigate('shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowRight className="w-4 h-4 rtl-flip" />
        <span>بازگشت به فروشگاه</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden flex items-center justify-center p-4">
            <img
              src={selectedImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain"
            />
            {product.discountPrice && (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                تخفیف ویژه
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border p-1 bg-neutral-900 transition-all ${
                    selectedImage === img
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={img}
                    alt={`تصویر ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-neutral-400 block">{product.brand} · {product.categoryName}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>
            {product.englishTitle && (
              <p className="text-xs text-neutral-400 font-mono dir-ltr text-right">{product.englishTitle}</p>
            )}

            <div className="flex items-center gap-3 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold">{toPersianDigits(product.rating)}</span>
              </div>
              <span>·</span>
              <span>{toPersianDigits(product.reviewsCount)} دیدگاه خریداران</span>
              <span>·</span>
              <span className={product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {product.stock > 0 ? `موجود در انبار (${toPersianDigits(product.stock)} عدد)` : 'ناموجود'}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-[#14161d] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 block">قیمت نهایی محصول:</span>
              <span className="text-[11px] text-neutral-500">شامل مالیات بر ارزش افزوده</span>
            </div>
            <div className="text-left">
              {product.discountPrice ? (
                <div>
                  <span className="text-xs text-neutral-500 line-through tabular-nums block">
                    {formatToman(product.price)}
                  </span>
                  <span className="text-2xl font-black text-[#d4af37] tabular-nums">
                    {formatToman(product.discountPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-black text-white tabular-nums">
                  {formatToman(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {product.description}
          </p>

          {/* Volume / Weight */}
          {product.volumeOrWeight && (
            <div className="text-xs text-neutral-300">
              <span className="text-neutral-400">حجم / وزن بسته:</span>{' '}
              <strong className="text-white">{product.volumeOrWeight}</strong>
            </div>
          )}

          {/* Stepper & Add to cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center bg-[#14161d] border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-neutral-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-white tabular-nums">
                {toPersianDigits(quantity)}
              </span>
              <button
                disabled={quantity >= product.stock}
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-neutral-300 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              disabled={product.stock <= 0}
              onClick={() => addToCart(product, quantity)}
              className="flex-1 py-3.5 bg-[#d4af37] hover:bg-[#e0be49] text-neutral-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>افزودن به سبد خرید</span>
            </button>

            <button
              onClick={() => toggleFavorite(product.id)}
              className="p-3.5 rounded-xl border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-colors"
              title="نشان کردن"
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite(product.id) ? 'fill-[#d4af37] text-[#d4af37]' : ''
                }`}
              />
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-3 text-center text-[11px] text-neutral-400">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] mx-auto" />
              <span>ضمانت اصالت ۱۰۰٪</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <Truck className="w-4 h-4 text-[#d4af37] mx-auto" />
              <span>ارسال سریع اکسپرس</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <RotateCcw className="w-4 h-4 text-[#d4af37] mx-auto" />
              <span>۷ روز ضمانت بازگشت</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="bg-[#14161d] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">مشخصات فنی و ترکیبات محصول</h3>
        <div className="divide-y divide-white/5 text-xs">
          {product.specifications.map((spec, index) => (
            <div key={index} className="grid grid-cols-3 py-3">
              <span className="text-neutral-400">{spec.key}</span>
              <span className="col-span-2 text-white font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">محصولات مرتبط پیشنهادی</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('product-detail', { productId: rel.id })}
                className="p-4 rounded-2xl bg-[#14161d] border border-white/5 hover:border-[#d4af37]/40 cursor-pointer transition-all flex items-center gap-4"
              >
                <img
                  src={rel.images[0]}
                  alt={rel.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-contain bg-neutral-900 p-1"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{rel.title}</h4>
                  <span className="text-xs font-bold text-[#d4af37] tabular-nums block">
                    {formatToman(rel.discountPrice ?? rel.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
