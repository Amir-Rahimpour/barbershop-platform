import {
  Barber,
  ServiceCategory,
  Service,
  ProductCategory,
  Product,
  Appointment,
  Order,
  Coupon,
  Review,
  SalonInfo,
  User
} from '../types';

export const INITIAL_SALON_INFO: SalonInfo = {
  name: 'باربرشاپ رویال',
  slogan: 'تجربه استایل اختصاصی و اصیل آقایان در فضایی لوکس و آرامش‌بخش',
  phone: '۰۲۱-۲۲۸۹۴۵۱۰',
  phoneSecondary: '۰۹۱۲۳۴۵۶۷۸۹',
  address: 'تهران، سعادت‌آباد، بلوار سرو غربی، نبش خیابان مروارید، مجتمع رویال سنتر، طبقه ۲',
  workHoursSummary: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۲:۰۰ | جمعه‌ها: ۱۲:۰۰ الی ۱۹:۰۰',
  instagram: 'barbershop_royal',
  telegram: 'barbershop_royal',
  whatsapp: '+989123456789',
  email: 'info@barbershop-royal.ir'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'محمدرضا',
    lastName: 'افشار',
    phone: '09121111111',
    email: 'admin@barbershop.ir',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '1402/10/01'
  },
  {
    id: 'user-barber-1',
    name: 'سامان',
    lastName: 'رستمی',
    phone: '09122222222',
    email: 'saman@barbershop.ir',
    role: 'barber',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '1402/10/05'
  },
  {
    id: 'user-customer',
    name: 'علیرضا',
    lastName: 'صادقی',
    phone: '09123456789',
    email: 'alireza@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '1403/01/15'
  }
];

export const INITIAL_WORKING_HOURS = [
  { dayOfWeek: 0, dayName: 'شنبه', isOpen: true, startTime: '10:00', endTime: '21:30', breakStartTime: '14:00', breakEndTime: '15:00' },
  { dayOfWeek: 1, dayName: 'یکشنبه', isOpen: true, startTime: '10:00', endTime: '21:30', breakStartTime: '14:00', breakEndTime: '15:00' },
  { dayOfWeek: 2, dayName: 'دوشنبه', isOpen: true, startTime: '10:00', endTime: '21:30', breakStartTime: '14:00', breakEndTime: '15:00' },
  { dayOfWeek: 3, dayName: 'سه‌شنبه', isOpen: true, startTime: '10:00', endTime: '21:30', breakStartTime: '14:00', breakEndTime: '15:00' },
  { dayOfWeek: 4, dayName: 'چهارشنبه', isOpen: true, startTime: '10:00', endTime: '21:30', breakStartTime: '14:00', breakEndTime: '15:00' },
  { dayOfWeek: 5, dayName: 'پنج‌شنبه', isOpen: true, startTime: '09:30', endTime: '22:00', breakStartTime: '14:00', breakEndTime: '15:00' },
  { dayOfWeek: 6, dayName: 'جمعه', isOpen: true, startTime: '12:00', endTime: '19:00', breakStartTime: undefined, breakEndTime: undefined }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    userId: 'user-barber-1',
    name: 'سامان رستمی',
    title: 'مستر استایلیست و هیرکاتور ارشد',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'با ۱۱ سال تجربه حرفه‌ای در سبک‌های کلاسیک انگلیسی و فیدهای مدرن. مدرس دوره‌های تخصصی قیچی و اصلاح کلاسیک.',
    rating: 4.9,
    reviewsCount: 148,
    experienceYears: 11,
    specialtyServiceIds: ['srv-1', 'srv-2', 'srv-5', 'srv-6', 'srv-9'],
    isActive: true,
    workingHours: INITIAL_WORKING_HOURS
  },
  {
    id: 'barber-2',
    userId: 'user-barber-2',
    name: 'کامران یزدانی',
    title: 'متخصص گریم داماد و مراقبت پوست',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'دارای مدرک بین‌المللی اسکین‌کر و گریم تخصصی داماد از ترکیه. مهارت ویژه در هماهنگی فرم چهره با حالت ریش و مو.',
    rating: 4.8,
    reviewsCount: 112,
    experienceYears: 8,
    specialtyServiceIds: ['srv-3', 'srv-4', 'srv-5', 'srv-7', 'srv-8'],
    isActive: true,
    workingHours: INITIAL_WORKING_HOURS
  },
  {
    id: 'barber-3',
    userId: 'user-barber-3',
    name: 'نیما کیان‌مهر',
    title: 'استایلیست تخصصی فید و طراحی ریش',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'استاد تکنیک‌های فید برزیلی، اسکالپ و فرم‌دهی لوکس ریش با متد حوله بخار معطر و تیغ‌های ضدحساسیت.',
    rating: 4.9,
    reviewsCount: 96,
    experienceYears: 7,
    specialtyServiceIds: ['srv-1', 'srv-2', 'srv-6', 'srv-9'],
    isActive: true,
    workingHours: INITIAL_WORKING_HOURS
  }
];

export const INITIAL_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-hair', name: 'آرایش و پیرایش مو', slug: 'hair', description: 'انواع هیرکات ژورنالی، کلاسیک و فرم‌دهی مو', iconName: 'Scissors' },
  { id: 'cat-facial', name: 'فیشیال و پاکسازی صورت', slug: 'facial', description: 'لایه‌برداری، آبرسانی عمیق و جوانسازی پوست', iconName: 'Sparkles' },
  { id: 'cat-groom', name: 'گریم و استایل داماد', slug: 'groom', description: 'پکیج‌های کامل و اختصاصی استایل روز عروسی', iconName: 'Crown' },
  { id: 'cat-beard', name: 'مراقبت و فرم‌دهی ریش', slug: 'beard', description: 'اصلاح با حوله داغ، خط‌زنی و تقویت ریش', iconName: 'Smile' },
  { id: 'cat-care', name: 'مانیکور و پدیکور', slug: 'care', description: 'بهداشت دست و پا، سوهان‌کشی و اسپا', iconName: 'Footprints' },
  { id: 'cat-package', name: 'پکیج‌های ویژه رویال', slug: 'package', description: 'ترکیب خدمات با تخفیف ویژه و پذیرایی VIP', iconName: 'PackageCheck' }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    categoryId: 'cat-hair',
    categoryName: 'آرایش و پیرایش مو',
    name: 'هیرکات کلاسیک و مدرن (VIP)',
    description: 'شامل مشاوره فرم صورت، شستشوی تخصصی مو با شامپوهای ارگانیک، اجرای دقیق کوتاهی با قیچی دست‌ساز، استایلینگ نهایی و خوشبوکننده فرانسوی.',
    durationMinutes: 45,
    price: 350000,
    benefits: ['مشاوره تخصصی فرم چهره', 'شستشو با ماساژور پوست سر', 'استفاده از متریال ارگانیک', 'استایلینگ نهایی'],
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-1', 'barber-3'],
    rating: 4.9,
    reviewsCount: 84
  },
  {
    id: 'srv-2',
    categoryId: 'cat-hair',
    categoryName: 'آرایش و پیرایش مو',
    name: 'استایل و فرم‌دهی مو با براشینگ حرفه‌ای',
    description: 'فرم‌دهی سه‌بعدی مو بر اساس موقعیت‌های رسمی یا کاری با استفاده از پمادهای مات فرانسوی و اسپری پایدارکننده سبک.',
    durationMinutes: 30,
    price: 220000,
    benefits: ['حالت‌دهی مقاوم در برابر رطوبت', 'عدم آسیب به ساختار مو', 'استفاده از باد خنک یونی'],
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-1', 'barber-3'],
    rating: 4.8,
    reviewsCount: 39
  },
  {
    id: 'srv-3',
    categoryId: 'cat-facial',
    categoryName: 'فیشیال و پاکسازی صورت',
    name: 'فیشیال تخصصی و آبرسانی عمیق پوست',
    description: 'شامل بخور گرم گیاهی، تخلیه کومودون‌ها، درمااف اولتراسونیک، ماسک جلبک دریایی و سرم هیالورونیک اسید برای رفع کامل تیرگی و خشکی پوست.',
    durationMinutes: 60,
    price: 680000,
    discountPrice: 590000,
    benefits: ['پاکسازی عمقی منافذ', 'رفع تیرگی و کدری چهره', 'لیفت ملایم و اکسیژن‌رسانی', 'ماساژ ریلکسی صورت'],
    image: 'https://images.unsplash.com/photo-1512290900672-1f55b9e07584?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-2'],
    rating: 5.0,
    reviewsCount: 52
  },
  {
    id: 'srv-4',
    categoryId: 'cat-facial',
    categoryName: 'فیشیال و پاکسازی صورت',
    name: 'پاکسازی و لایه‌برداری با دستگاه درمااف',
    description: 'لایه برداری سلول‌های مرده، کنترل چربی ناحیه T-Zone و بستن منافذ باز پوست همراه با بخور عصاره رزماری و اسطوخودوس.',
    durationMinutes: 45,
    price: 490000,
    benefits: ['روشن‌سازی پوست در یک جلسه', 'کاهش جوش‌های سرسیاه', 'تنظیم ترشح سبوم'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-2'],
    rating: 4.8,
    reviewsCount: 41
  },
  {
    id: 'srv-5',
    categoryId: 'cat-groom',
    categoryName: 'گریم و استایل داماد',
    name: 'پکیج VIP گریم و هیرکات داماد',
    description: 'پکیج جامع ویژه دامادها: پاکسازی پوست، هیرکات اختصاصی ۲ روز قبل و روز مراسم، اصلاح و خط ریش، فون و گریم مات ضدتعریق عکاسی و تثبیت ماندگار.',
    durationMinutes: 120,
    price: 2800000,
    discountPrice: 2450000,
    benefits: ['بدون رد و درخشش در عکس و فیلم', 'ماندگاری ۱۸ ساعته گریم', 'تست استایل قبل از روز عروسی', 'پذیرایی کامل VIP'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-1', 'barber-2'],
    rating: 5.0,
    reviewsCount: 78
  },
  {
    id: 'srv-6',
    categoryId: 'cat-beard',
    categoryName: 'مراقبت و فرم‌دهی ریش',
    name: 'اصلاح و فرم‌دهی ریش با حوله داغ سنتی',
    description: 'تجربه سنتی ایتالیایی با کرم پیش‌اصلاح اکالیپتوس، حوله بخار معطر، تیغ ژاپنی یک‌بارمصرف استریل و روغن آرگان مراکشی.',
    durationMinutes: 35,
    price: 250000,
    benefits: ['جلوگیری از التهاب و سوزش تیغ', 'تقویت ریشه و نرمی ریش', 'آرامش عضلات فک با حوله داغ'],
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-1', 'barber-3'],
    rating: 4.9,
    reviewsCount: 93
  },
  {
    id: 'srv-7',
    categoryId: 'cat-care',
    categoryName: 'مانیکور و پدیکور',
    name: 'مانیکور دست و بهداشت ناخن آقایان',
    description: 'کوتاهی اصولی، رفع پوسته‌های اضافی دور ناخن، بافر درخشان‌کننده بدون لاک و ماساژ دست با کرم موم زنبور عسل.',
    durationMinutes: 40,
    price: 320000,
    benefits: ['بهبود ظاهر و پرستیژ دست‌ها', 'جلوگیری از گوشه‌کردن ناخن', 'ماساژ ریلکسی انگشتان و ساعد'],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-2'],
    rating: 4.7,
    reviewsCount: 28
  },
  {
    id: 'srv-8',
    categoryId: 'cat-care',
    categoryName: 'مانیکور و پدیکور',
    name: 'پدیکور درمانی و اسپا پا با کوکتل گیاهی',
    description: 'جکوزی اختصاصی پا با نمک صورتی هیمالیا، لایه‌برداری پاشنه پا، سم‌زدایی و ماساژ با روغن سیاه‌دانه.',
    durationMinutes: 50,
    price: 420000,
    benefits: ['رفع خستگی مفرط پاها', 'نرمی و از بین رفتن زبری پاشنه', 'افزایش گردش خون'],
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-2'],
    rating: 4.9,
    reviewsCount: 34
  },
  {
    id: 'srv-9',
    categoryId: 'cat-package',
    categoryName: 'پکیج‌های ویژه رویال',
    name: 'پکیج سلطنتی رویال جنتلمن',
    description: 'شامل هیرکات کامل، اصلاح ریش با حوله داغ، فیشیال اکسیژن‌پلاس، ماسک تقویت‌کننده و پذیرایی در لژ VIP.',
    durationMinutes: 110,
    price: 1190000,
    discountPrice: 990000,
    benefits: ['تخفیف ۲۰ درصدی نسبت به خدمات تکی', 'صرفه‌جویی در زمان', 'پذیرایی با قهوه تازه و آبمیوه طبیعی'],
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    barberIds: ['barber-1', 'barber-3'],
    rating: 5.0,
    reviewsCount: 65
  }
];

export const INITIAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'prod-cat-hair', name: 'محصولات مو', slug: 'hair-care', description: 'پماد، واکس مات، شامپوهای تخصصی و سرم ضدریزش', count: 4 },
  { id: 'prod-cat-skin', name: 'محصولات پوست', slug: 'skin-care', description: 'سرم‌های جوانساز، ژل شستشوی کربن فعال و کرم‌های مرطوب‌کننده', count: 3 },
  { id: 'prod-cat-beard', name: 'مراقبت از ریش', slug: 'beard-care', description: 'روغن‌های تغذیه‌کننده ریش، بالم و شامپو ریش', count: 3 },
  { id: 'prod-cat-tools', name: 'ابزار آرایشگری', slug: 'barber-tools', description: 'شانه‌های چوب صندل، برس‌های موی گراز و موپران‌های لوکس', count: 2 },
  { id: 'prod-cat-perfume', name: 'عطر و افترشیو', slug: 'perfume-aftershave', description: 'ادکلن‌های دست‌ساز تلخ و ادویه‌ای و افترشیوهای آرامش‌بخش', count: 2 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    categoryId: 'prod-cat-hair',
    categoryName: 'محصولات مو',
    title: 'پماد موی مات رویال باربر مدل Matte Clay',
    englishTitle: 'Royal Matte Styling Clay 100ml',
    description: 'پماد موی مات بر پایه خاک رس طبیعی و موم کارناوبا. قدرت نگهداری بسیار بالا (High Hold) بدون هیچ‌گونه براقیت و چربی با شستشوی آسان با آب.',
    price: 480000,
    discountPrice: 420000,
    stock: 24,
    rating: 4.9,
    reviewsCount: 46,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597854710119-a5a8fc257f86?w=500&auto=format&fit=crop&q=80'
    ],
    volumeOrWeight: '۱۰۰ میلی‌لیتر',
    brand: 'Royal Grooming UK',
    specifications: [
      { key: 'میزان فیکساتور', value: 'بسیار قوی (سطح ۵)' },
      { key: 'جلوه نهایی', value: 'کاملاً مات طبیعی' },
      { key: 'پایه محصول', value: 'خاک رس کائولین و موم زنبور' },
      { key: 'نحوه شستشو', value: 'فقط با آب ولرم' }
    ]
  },
  {
    id: 'prod-2',
    categoryId: 'prod-cat-beard',
    categoryName: 'مراقبت از ریش',
    title: 'روغن تقویت و نرم‌کننده ریش مدل Sandalwood',
    englishTitle: 'Artisan Beard Oil Sandalwood 50ml',
    description: 'ترکیب غنی از روغن جوجوبا، آرگان اصیل مراکشی و عصاره چوب صندل قرمز. جلوگیری قطعی از خارش پوست زیر ریش و نرم‌کننده تار ریش‌های زبر.',
    price: 390000,
    discountPrice: 340000,
    stock: 18,
    rating: 5.0,
    reviewsCount: 38,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1608248597359-2e557b494747?w=500&auto=format&fit=crop&q=80'
    ],
    volumeOrWeight: '۵۰ میلی‌لیتر قطره‌چکان‌دار',
    brand: 'Barber & Co',
    specifications: [
      { key: 'رایحه', value: 'چوب صندل، عود و دارچین' },
      { key: 'خواص اصلی', value: 'آبرسانی پوست و ضد خارش' },
      { key: 'ترکیبات ارگانیک', value: '۱۰۰٪ طبیعی و وگان' }
    ]
  },
  {
    id: 'prod-3',
    categoryId: 'prod-cat-skin',
    categoryName: 'محصولات پوست',
    title: 'سرم جوانساز و ضدخستگی هیالورونیک اسید آقایان',
    englishTitle: 'Men Defense Hyaluronic Face Serum',
    description: 'فرمولاسیون اختصاصی سبک و زودجذب برای پوست ضخیم‌تر آقایان. کاهش خطوط اخم و خستگی چهره با جذب رطوبت تا ۱۰۰۰ برابر وزن خود.',
    price: 650000,
    discountPrice: 580000,
    stock: 12,
    rating: 4.8,
    reviewsCount: 29,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80'
    ],
    volumeOrWeight: '۳۰ میلی‌لیتر',
    brand: 'DermaLab Homme',
    specifications: [
      { key: 'نوع پوست', value: 'مناسب انواع پوست حتی چرب و آکنه‌ای' },
      { key: 'زمان مصرف', value: 'صبح‌ها بعد از اصلاح و شب قبل خواب' },
      { key: 'فاقد مواد مضر', value: 'بدون پارابن، چربی و الکل' }
    ]
  },
  {
    id: 'prod-4',
    categoryId: 'prod-cat-tools',
    categoryName: 'ابزار آرایشگری',
    title: 'برس ریش و مو با الیاف طبیعی موی گراز و چوب گردو',
    englishTitle: 'Handcrafted Boar Bristle Beard Brush',
    description: 'ساخته شده از چوب دست‌ساز گردوی ایرانی با موی طبیعی. پخش یکنواخت چربی مفید پوست روی تار ریش و جدا کردن موهای وز.',
    price: 310000,
    stock: 15,
    rating: 4.9,
    reviewsCount: 19,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500&auto=format&fit=crop&q=80'
    ],
    brand: 'Craftsman Barber',
    specifications: [
      { key: 'جنس دسته', value: 'چوب گردوی کهنه روغن‌خورده' },
      { key: 'نوع مو', value: 'موی طبیعی ضدالکتریسیته ساکن' },
      { key: 'ابعاد', value: '۱۱ در ۶ سانتی‌متر' }
    ]
  },
  {
    id: 'prod-5',
    categoryId: 'prod-cat-perfume',
    categoryName: 'عطر و افترشیو',
    title: 'افترشیو بالم التیام‌بخش با رایحه چرم و تنباکو',
    englishTitle: 'Leather & Tobacco Soothing Aftershave Balm',
    description: 'بالم غنی بدون الکل سوزاننده. التیام آنی پوست تحریک شده پس از تراشیدن تیغ، همراه با رایحه فاخر و کاریزماتیک چرم توسکانی.',
    price: 520000,
    discountPrice: 470000,
    stock: 9,
    rating: 5.0,
    reviewsCount: 31,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80'
    ],
    volumeOrWeight: '۱۲۰ میلی‌لیتر',
    brand: 'Gentleman Reserve',
    specifications: [
      { key: 'رایحه', value: 'چرم ایتالیایی، وانیل سیاه و تنباکو' },
      { key: 'حاوی', value: 'عصاره آلوئه‌ورا و کالاندولا' },
      { key: 'اثرگذاری', value: 'کاهش فوری قرمزی و سوزش تیغ' }
    ]
  },
  {
    id: 'prod-6',
    categoryId: 'prod-cat-hair',
    categoryName: 'محصولات مو',
    title: 'اسپری نمک دریایی حجم‌دهنده مو مدل Sea Salt',
    englishTitle: 'Texturizing Sea Salt Spray 200ml',
    description: 'ایجاد بافت طبیعی و موج‌دار به سبک ساحلی و جذاب. حاوی مواد معدنی دریای مرده و ویتامین B5 جهت تقویت تارهای نازک مو.',
    price: 360000,
    stock: 20,
    rating: 4.7,
    reviewsCount: 22,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1608248597359-2e557b494747?w=500&auto=format&fit=crop&q=80'
    ],
    volumeOrWeight: '۲۰۰ میلی‌لیتر',
    brand: 'Royal Grooming UK',
    specifications: [
      { key: 'عملکرد', value: 'افزایش چشمگیر حجم موهای کم‌پشت' },
      { key: 'جلوه', value: 'طبیعی بدون خشکی و چسبندگی' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    bookingCode: 'RB-9021',
    customerId: 'user-customer',
    customerName: 'علیرضا صادقی',
    customerPhone: '09123456789',
    barberId: 'barber-1',
    barberName: 'سامان رستمی',
    barberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    serviceId: 'srv-1',
    serviceName: 'هیرکات کلاسیک و مدرن (VIP)',
    serviceDuration: 45,
    date: '1403-07-15', // Format compatible with calculation
    startTime: '17:00',
    endTime: '17:45',
    price: 350000,
    status: 'confirmed',
    notes: 'استایل کلاسیک با خط فرق سمت چپ',
    createdAt: '1403/07/10'
  },
  {
    id: 'app-2',
    bookingCode: 'RB-9022',
    customerId: 'user-2',
    customerName: 'فرهاد مجیدی',
    customerPhone: '09129998877',
    barberId: 'barber-1',
    barberName: 'سامان رستمی',
    barberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    serviceId: 'srv-6',
    serviceName: 'اصلاح و فرم‌دهی ریش با حوله داغ سنتی',
    serviceDuration: 35,
    date: '1403-07-15',
    startTime: '18:00',
    endTime: '18:35',
    price: 250000,
    status: 'confirmed',
    createdAt: '1403/07/11'
  },
  {
    id: 'app-3',
    bookingCode: 'RB-8810',
    customerId: 'user-customer',
    customerName: 'علیرضا صادقی',
    customerPhone: '09123456789',
    barberId: 'barber-2',
    barberName: 'کامران یزدانی',
    barberAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    serviceId: 'srv-3',
    serviceName: 'فیشیال تخصصی و آبرسانی عمیق پوست',
    serviceDuration: 60,
    date: '1403-07-02',
    startTime: '16:00',
    endTime: '17:00',
    price: 590000,
    status: 'completed',
    createdAt: '1403/06/28'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-7814',
    customerId: 'user-customer',
    customerName: 'علیرضا صادقی',
    customerPhone: '09123456789',
    shippingAddress: 'تهران، زعفرانیه، خیابان آصف، کوچه بهار، پلاک ۱۲، واحد ۴',
    city: 'تهران',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    subtotal: 760000,
    discountAmount: 50000,
    shippingFee: 45000,
    totalAmount: 755000,
    status: 'delivered',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    trackingCode: 'TRK-9832145',
    createdAt: '1403/06/25'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'BARBER20', discountPercent: 20, maxDiscountAmount: 150000, minOrderAmount: 300000, isActive: true },
  { code: 'FIRST10', discountPercent: 10, maxDiscountAmount: 80000, minOrderAmount: 200000, isActive: true },
  { code: 'VIPGUEST', discountPercent: 15, maxDiscountAmount: 200000, minOrderAmount: 400000, isActive: true }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'مسعود تهرانی',
    targetType: 'service',
    targetId: 'srv-1',
    targetName: 'هیرکات کلاسیک و مدرن (VIP)',
    rating: 5,
    comment: 'بهترین تجربه‌ای که تو آرایشگاه داشتم. آقا سامان به جزئیات خیلی اهمیت میده و دقیقا همونی شد که می‌خواستم.',
    createdAt: '۳ روز پیش'
  },
  {
    id: 'rev-2',
    authorName: 'دکتر پویان ناصری',
    targetType: 'service',
    targetId: 'srv-3',
    targetName: 'فیشیال تخصصی و آبرسانی عمیق پوست',
    rating: 5,
    comment: 'محیط بسیار بهداشتی، بدون صدای اضافه و پرسنل فوق‌العاده با شخصیت. بعد از فیشیال واقعا حس سبکی داشتم.',
    createdAt: '۱ هفته پیش'
  },
  {
    id: 'rev-3',
    authorName: 'شاهین راد',
    targetType: 'barber',
    targetId: 'barber-1',
    targetName: 'سامان رستمی',
    rating: 5,
    comment: 'هنر دست سامان بی‌نظیره. بیش از سه ساله فقط پیش ایشون میام و همیشه راضی بودم.',
    createdAt: '۲ هفته پیش'
  },
  {
    id: 'rev-4',
    authorName: 'امیرحسین کاظمی',
    targetType: 'product',
    targetId: 'prod-1',
    targetName: 'پماد موی مات رویال باربر',
    rating: 5,
    comment: 'اصلا چرب نمیکنه مو رو و حالت ماتش تا شب ثابته. خیلی راضیم از خریدش.',
    createdAt: '۲ هفته پیش'
  }
];
