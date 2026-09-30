import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Clock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatToman, toPersianDigits } from '../utils/persianDate';

export const ServicesPage: React.FC = () => {
  const { services, serviceCategories, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((s) => s.categoryId === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
          <Scissors className="w-4 h-4" />
          <span>منوی کامل خدمات باربرشاپ رویال</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">خدمات تخصصی و تعرفه‌ها</h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          تمامی خدمات با پک‌های اختصاصی و استریل، متریال درجه‌یک اروپایی و توسط آرایشگران مجرب ارائه می‌گردد.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          همه خدمات ({toPersianDigits(services.length)})
        </button>

        {serviceCategories.map((cat) => {
          const count = services.filter((s) => s.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              {cat.name} ({toPersianDigits(count)})
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group bg-[#14161d] border border-white/10 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Service Image */}
              <div className="relative h-52 bg-neutral-900 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161d] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{toPersianDigits(service.durationMinutes)} دقیقه</span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-5 space-y-3">
                <span className="text-xs text-neutral-400">{service.categoryName}</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {/* Key Benefits */}
                <div className="pt-2 space-y-1.5">
                  {service.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 border-t border-white/5 mt-4 space-y-3">
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs text-neutral-400">هزینه خدمت:</span>
                <div className="text-right">
                  {service.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 line-through tabular-nums">
                        {formatToman(service.price)}
                      </span>
                      <span className="text-sm font-bold text-[#d4af37] tabular-nums">
                        {formatToman(service.discountPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatToman(service.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('service-detail', { serviceId: service.id })}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold rounded-xl transition-colors text-center"
                >
                  مشاهده جزئیات
                </button>
                <button
                  onClick={() => navigate('booking', { serviceId: service.id })}
                  className="w-full py-2.5 bg-[#d4af37] hover:bg-[#e2c14c] text-neutral-950 text-xs font-bold rounded-xl transition-colors text-center"
                >
                  رزرو این خدمت
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
