import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Barber,
  Service,
  ServiceCategory,
  Product,
  ProductCategory,
  Appointment,
  AppointmentStatus,
  Order,
  CartItem,
  Coupon,
  Review,
  NotificationItem,
  SalonInfo,
  WorkingHour
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BARBERS,
  INITIAL_SERVICES,
  INITIAL_SERVICE_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PRODUCT_CATEGORIES,
  INITIAL_APPOINTMENTS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_SALON_INFO
} from '../data/mockData';

export type AppRoute =
  | 'home'
  | 'services'
  | 'service-detail'
  | 'booking'
  | 'available-appointments'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'customer-dashboard'
  | 'admin-dashboard'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms';

export interface RouteParams {
  serviceId?: string;
  productId?: string;
  barberId?: string;
  dateStr?: string;
  startTime?: string;
  adminTab?: string;
  dashboardTab?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation
  currentRoute: AppRoute;
  routeParams: RouteParams;
  navigate: (route: AppRoute, params?: RouteParams) => void;

  // Auth & User
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (phone: string, role?: UserRole) => boolean;
  register: (name: string, phone: string, email?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Salon Info
  salonInfo: SalonInfo;
  updateSalonInfo: (info: Partial<SalonInfo>) => void;

  // Services
  services: Service[];
  serviceCategories: ServiceCategory[];
  addService: (service: Omit<Service, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;

  // Barbers
  barbers: Barber[];
  updateBarberSchedule: (barberId: string, hours: WorkingHour[]) => void;
  toggleBarberActive: (barberId: string) => void;

  // Products & Shop
  products: Product[];
  productCategories: ProductCategory[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart & Checkout
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    paymentMethod: 'online' | 'card_to_card' | 'cash_on_delivery';
  }) => Order;

  // Appointments / Bookings
  appointments: Appointment[];
  createAppointment: (appointmentData: {
    customerName: string;
    customerPhone: string;
    barberId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;

  // Wishlist
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;

  // Toast Feedback
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [routeParams, setRouteParams] = useState<RouteParams>({});

  // Core Data loaded from localStorage if exists, fallback to MockData
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('barbershop_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[2]; // Default to signed-in customer for rich instant experience
  });

  const [salonInfo, setSalonInfo] = useState<SalonInfo>(() => {
    const saved = localStorage.getItem('barbershop_info');
    return saved ? JSON.parse(saved) : INITIAL_SALON_INFO;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('barbershop_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [serviceCategories] = useState<ServiceCategory[]>(INITIAL_SERVICE_CATEGORIES);

  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('barbershop_barbers');
    return saved ? JSON.parse(saved) : INITIAL_BARBERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('barbershop_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [productCategories] = useState<ProductCategory[]>(INITIAL_PRODUCT_CATEGORIES);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('barbershop_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('barbershop_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('barbershop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('barbershop_favorites');
    return saved ? JSON.parse(saved) : ['prod-1', 'srv-1'];
  });

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'user-customer',
      title: 'یادآوری نوبت رزرو',
      message: 'نوبت شما برای اصلاح و هیرکات با سامان رستمی ثبت شده است.',
      type: 'booking',
      isRead: false,
      createdAt: 'امروز'
    },
    {
      id: 'notif-2',
      userId: 'user-customer',
      title: 'سفارش ثبت شد',
      message: 'سفارش پماد موی مات با موفقیت ارسال شد.',
      type: 'order',
      isRead: true,
      createdAt: 'دیروز'
    }
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('barbershop_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('barbershop_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('barbershop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('barbershop_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('barbershop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('barbershop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('barbershop_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('barbershop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('barbershop_barbers', JSON.stringify(barbers));
  }, [barbers]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigate = (route: AppRoute, params: RouteParams = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth
  const login = (phone: string, role: UserRole = 'customer') => {
    const found = INITIAL_USERS.find((u) => u.phone === phone);
    if (found) {
      setCurrentUser(found);
      showToast(`خوش آمدید، ${found.name} عزیز`, 'success');
      return true;
    }
    const newUser: User = {
      id: 'user-' + Date.now(),
      phone,
      name: 'کاربر گرامی',
      role,
      createdAt: '1403/07/15'
    };
    setCurrentUser(newUser);
    showToast('ورود با موفقیت انجام شد', 'success');
    return true;
  };

  const register = (name: string, phone: string, email?: string) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      phone,
      email,
      role: 'customer', // strictly customer for public registration
      createdAt: '1403/07/15'
    };
    setCurrentUser(newUser);
    showToast(`ثبت‌نام با موفقیت انجام شد. خوش آمدید ${name}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('شما با موفقیت خارج شدید', 'info');
    navigate('home');
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) {
      const targetUser = INITIAL_USERS.find((u) => u.role === role) || {
        id: 'user-demo-' + role,
        name: role === 'admin' ? 'مدیر سیستم' : role === 'barber' ? 'سامان رستمی' : 'مشتری تست',
        phone: '09120000000',
        role,
        createdAt: '1403/01/01'
      };
      setCurrentUser(targetUser);
    } else {
      setCurrentUser({ ...currentUser, role });
    }
    showToast(`نقش کاربری به «${role === 'admin' ? 'مدیر سیستم' : role === 'barber' ? 'آرایشگر' : 'مشتری'}» تغییر یافت`, 'info');
  };

  // Salon Info
  const updateSalonInfo = (info: Partial<SalonInfo>) => {
    setSalonInfo((prev) => {
      const updated = { ...prev, ...info };
      localStorage.setItem('barbershop_info', JSON.stringify(updated));
      return updated;
    });
    showToast('اطلاعات آرایشگاه به‌روزرسانی شد', 'success');
  };

  // Services
  const addService = (newServiceData: Omit<Service, 'id' | 'rating' | 'reviewsCount'>) => {
    const srv: Service = {
      ...newServiceData,
      id: 'srv-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1
    };
    setServices((prev) => [srv, ...prev]);
    showToast(`خدمت «${srv.name}» با موفقیت اضافه شد`, 'success');
  };

  const updateService = (updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`خدمت «${updated.name}» به‌روزرسانی شد`, 'success');
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('خدمت موردنظر حذف گردید', 'info');
  };

  // Barbers
  const updateBarberSchedule = (barberId: string, hours: WorkingHour[]) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === barberId ? { ...b, workingHours: hours } : b))
    );
    showToast('برنامه کاری آرایشگر ذخیره شد', 'success');
  };

  const toggleBarberActive = (barberId: string) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === barberId ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Products
  const addProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const prod: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
      rating: 5.0,
      reviewsCount: 0
    };
    setProducts((prev) => [prod, ...prev]);
    showToast(`محصول «${prod.title}» به فروشگاه افزوده شد`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`محصول «${updated.title}» به‌روزرسانی شد`, 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('محصول حذف شد', 'info');
  };

  // Cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`«${product.title}» به سبد خرید اضافه شد`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('محصول از سبد خرید حذف شد', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.discountPrice ?? item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Coupon
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find(
      (c) => c.code === cleanCode && c.isActive
    );
    if (!found) {
      return { success: false, message: 'کد تخفیف معتبر نیست یا منقضی شده است' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `حداقل مبلغ سفارش برای این کد باید بیش از ${found.minOrderAmount.toLocaleString()} تومان باشد`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `کد تخفیف ${found.discountPercent}٪ اعمال گردید` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('کد تخفیف حذف شد', 'info');
  };

  // Orders
  const createOrder = ({
    customerName,
    customerPhone,
    shippingAddress,
    city,
    paymentMethod
  }: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    paymentMethod: 'online' | 'card_to_card' | 'cash_on_delivery';
  }): Order => {
    const shippingFee = cartSubtotal > 1000000 ? 0 : 45000;
    let discountAmount = 0;
    if (appliedCoupon) {
      const calcDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
      discountAmount = Math.min(calcDiscount, appliedCoupon.maxDiscountAmount);
    }
    const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingFee);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerId: currentUser?.id || 'guest',
      customerName,
      customerPhone,
      shippingAddress,
      city,
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      trackingCode: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    // Decrement stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: currentUser?.id || 'guest',
      title: 'سفارش جدید شما ثبت شد',
      message: `سفارش شماره ${newOrder.orderNumber} با موفقیت در سیستم ثبت گردید.`,
      type: 'order',
      isRead: false,
      createdAt: 'لحظاتی پیش'
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`سفارش ${newOrder.orderNumber} با موفقیت ثبت شد`, 'success');
    return newOrder;
  };

  // Appointments
  const createAppointment = ({
    customerName,
    customerPhone,
    barberId,
    serviceId,
    date,
    startTime,
    endTime,
    notes
  }: {
    customerName: string;
    customerPhone: string;
    barberId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }): Appointment => {
    const targetBarber = barbers.find((b) => b.id === barberId) || barbers[0];
    const targetService = services.find((s) => s.id === serviceId) || services[0];

    const newApp: Appointment = {
      id: 'app-' + Date.now(),
      bookingCode: 'RB-' + Math.floor(1000 + Math.random() * 9000),
      customerId: currentUser?.id || 'guest',
      customerName,
      customerPhone,
      barberId: targetBarber.id,
      barberName: targetBarber.name,
      barberAvatar: targetBarber.avatar,
      serviceId: targetService.id,
      serviceName: targetService.name,
      serviceDuration: targetService.durationMinutes,
      date,
      startTime,
      endTime,
      price: targetService.discountPrice ?? targetService.price,
      status: 'confirmed',
      notes,
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    setAppointments((prev) => [newApp, ...prev]);

    // Notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: currentUser?.id || 'guest',
      title: 'نوبت شما تایید شد',
      message: `نوبت پیرایش برای تاریخ ${date} ساعت ${startTime} نزد ${targetBarber.name} رزرو گردید.`,
      type: 'booking',
      isRead: false,
      createdAt: 'لحظاتی پیش'
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`نوبت شما با کد ${newApp.bookingCode} ثبت و تایید شد`, 'success');
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    const statusText =
      status === 'confirmed'
        ? 'تأیید'
        : status === 'completed'
        ? 'تکمیل'
        : status === 'cancelled'
        ? 'لغو'
        : 'در انتظار';
    showToast(`وضعیت نوبت به «${statusText}» تغییر یافت`, 'info');
  };

  const cancelAppointment = (id: string) => {
    updateAppointmentStatus(id, 'cancelled');
  };

  // Wishlist
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('از لیست نشان‌شده‌ها حذف شد', 'info');
        return prev.filter((item) => item !== id);
      }
      showToast('به لیست علاقه‌مندی‌ها اضافه شد', 'success');
      return [...prev, id];
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const rev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      createdAt: 'لحظاتی پیش'
    };
    setReviews((prev) => [rev, ...prev]);
    showToast('دیدگاه ارزشمند شما با موفقیت ثبت شد', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        routeParams,
        navigate,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        switchRole,
        salonInfo,
        updateSalonInfo,
        services,
        serviceCategories,
        addService,
        updateService,
        deleteService,
        barbers,
        updateBarberSchedule,
        toggleBarberActive,
        products,
        productCategories,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        createOrder,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        favorites,
        toggleFavorite,
        isFavorite,
        reviews,
        addReview,
        notifications,
        markNotificationAsRead,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
