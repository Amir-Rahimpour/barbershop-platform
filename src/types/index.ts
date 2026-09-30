export type UserRole = 'customer' | 'barber' | 'staff' | 'admin' | 'superadmin';

export interface User {
  id: string;
  phone: string;
  name: string;
  lastName?: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface CustomerProfile {
  userId: string;
  address: string;
  city: string;
  postalCode?: string;
  loyaltyPoints: number;
  totalOrdersCount: number;
  totalBookingsCount: number;
}

export interface WorkingHour {
  dayOfWeek: number; // 0: شنبه, 1: یکشنبه, ..., 6: جمعه
  dayName: string;
  isOpen: boolean;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "21:00"
  breakStartTime?: string; // e.g. "13:30"
  breakEndTime?: string;   // e.g. "15:00"
}

export interface DayOff {
  id: string;
  barberId: string;
  date: string; // YYYY-MM-DD or Jalali YYYY/MM/DD
  reason: string;
}

export interface Barber {
  id: string;
  userId: string;
  name: string;
  title: string; // e.g. "استاد پیرایش و استایلیست ارشد"
  avatar: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  specialtyServiceIds: string[];
  isActive: boolean;
  workingHours: WorkingHour[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number; // Toman
  discountPrice?: number;
  benefits: string[];
  image: string;
  isActive: boolean;
  barberIds: string[];
  rating: number;
  reviewsCount: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  barberId: string;
  barberName: string;
  barberAvatar: string;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  date: string; // "1403/07/15" or ISO
  startTime: string; // "17:00"
  endTime: string;   // "18:00"
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  englishTitle?: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  images: string[];
  specifications: { key: string; value: string }[];
  volumeOrWeight?: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'online' | 'card_to_card' | 'cash_on_delivery';
  paymentStatus: 'paid' | 'pending';
  trackingCode?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  avatar?: string;
  targetType: 'service' | 'barber' | 'product';
  targetId: string;
  targetName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'order' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface SalonInfo {
  name: string;
  slogan: string;
  phone: string;
  phoneSecondary: string;
  address: string;
  workHoursSummary: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  email: string;
}
