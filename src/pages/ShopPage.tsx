import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Search,
  Star,
  Filter,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';

export const ShopPage: React.FC = () => {
  const {
    products,
    productCategories,
    addToCart,
    toggleFavorite,
    isFavorite,
    navigate
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.englishTitle && p.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
          <ShoppingBag className="w-4 h-4" />
          <span>فروشگاه لوازم مراقبت شخصی و آرایشگری</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">محصولات تخصصی آقایان</h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          محصولات ارگانیک و حرفه‌ای مورد استفاده در سالن رویال با ضمانت اصالت ۱۰۰٪.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی محصول، برند، ویژگی..."
            className="w-full bg-[#14161d] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sort Select */}
        <div className="w-full md:w-auto flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-4 h-4 text-[#d4af37]" />
          <span className="text-neutral-400">مرتب‌سازی:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#14161d] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
          >
            <option value="featured">پیشنهاد باربرشاپ</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="rating">بالاترین امتیاز</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          همه محصولات ({toPersianDigits(products.length)})
        </button>
        {productCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative h-52 bg-neutral-900 rounded-xl overflow-hidden mb-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {product.discountPrice && (
                    <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      تخفیف ویژه
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-rose-400 transition-colors"
                    aria-label="نشان کردن"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isFavorite(product.id)
                          ? 'fill-[#d4af37] text-[#d4af37]'
                          : 'text-neutral-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-neutral-400">{product.brand}</span>
                  <h3
                    onClick={() => navigate('product-detail', { productId: product.id })}
                    className="text-xs sm:text-sm font-bold text-white hover:text-[#d4af37] cursor-pointer line-clamp-2 transition-colors"
                  >
                    {product.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-amber-400">
                    <span>{toPersianDigits(product.rating)}</span>
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                  <div className="text-right">
                    {product.discountPrice ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-neutral-500 line-through tabular-nums">
                          {formatToman(product.price)}
                        </span>
                        <span className="text-xs font-bold text-[#d4af37] tabular-nums">
                          {formatToman(product.discountPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-white tabular-nums">
                        {formatToman(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product)}
                  className="w-full py-2.5 bg-white/5 hover:bg-[#d4af37] hover:text-neutral-950 text-neutral-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#14161d] border border-white/5 rounded-2xl space-y-3">
          <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">محصولی یافت نشد</h3>
          <p className="text-xs text-neutral-400">عبارت دیگری را جستجو فرمایید یا دسته‌بندی را تغییر دهید.</p>
        </div>
      )}
    </div>
  );
};
