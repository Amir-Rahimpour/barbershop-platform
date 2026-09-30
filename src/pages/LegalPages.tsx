import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export const LegalPages: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-right">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
          {type === 'privacy' ? <ShieldCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          <span>قوانین و استانداردهای قانونی باربرشاپ رویال</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          {type === 'privacy' ? 'سیاست حفظ حریم خصوصی' : 'شرایط و ضوابط نوبت‌دهی و خرید'}
        </h1>
      </div>

      <div className="p-8 rounded-2xl bg-[#14161d] border border-white/10 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed">
        {type === 'privacy' ? (
          <>
            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">۱. جمع‌آوری و امنیت اطلاعات</h3>
              <p>
                مجموعه باربرشاپ رویال متعهد است که از اطلاعات خصوصی کاربران (شامل شماره تماس، نام و آدرس پستی) به صورت کامل محافظت نماید. این اطلاعات صرفاً جهت اطلاع‌رسانی پیامکی وضعیت نوبت و ارسال خریدهای فروشگاهی استفاده می‌شود و در اختیار هیچ سازمان ثالثی قرار نمی‌گیرد.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">۲. محرمانگی سوابق رزرو</h3>
              <p>
                کلیه سوابق خدمات دریافتی، فرمول‌های رنگ مو، پرونده‌های پوستی و ترجیحات استایل شما در پایگاه داده امن اختصاصی سالن به صورت رمزنگاری‌شده نگهداری می‌شود.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">۱. قوانین حضور در نوبت‌های رزرو شده</h3>
              <p>
                مراجعین گرامی موظف هستند ۱۰ دقیقه پیش از ساعت رزرو در محل سالن حضور داشته باشند. در صورت تاخیر بیش از ۱۵ دقیقه، به منظور رعایت حقوق نوبت‌های بعدی، ممکن است خدمت با اولویت زمان باقیمانده انجام شود.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">۲. لغو و تغییر زمان نوبت</h3>
              <p>
                امکان لغو نوبت تا ۳ ساعت پیش از موعد مقرر از طریق پنل کاربری بدون هزینه امکان‌پذیر است. لغو در ساعات نزدیک‌تر مشمول تذکر سیستمی خواهد بود.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-white">۳. ضمانت بازگشت و اصالت محصولات فروشگاه</h3>
              <p>
                تمامی کالاهای خریداری‌شده از فروشگاه آنلاین در صورت باز نشدن پلمپ بهداشتی، تا ۷ روز کاری قابل عودت یا تعویض می‌باشند.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
