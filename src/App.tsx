import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';
import { MobileBottomNav } from './components/common/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { BookingPage } from './pages/BookingPage';
import { AvailableAppointmentsPage } from './pages/AvailableAppointmentsPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPages } from './pages/AuthPages';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { LegalPages } from './pages/LegalPages';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      {currentRoute === 'home' && <HomePage />}
      {currentRoute === 'services' && <ServicesPage />}
      {currentRoute === 'service-detail' && <ServiceDetailPage />}
      {currentRoute === 'booking' && <BookingPage />}
      {currentRoute === 'available-appointments' && <AvailableAppointmentsPage />}
      {currentRoute === 'shop' && <ShopPage />}
      {currentRoute === 'product-detail' && <ProductDetailPage />}
      {currentRoute === 'cart' && <CartPage />}
      {currentRoute === 'checkout' && <CheckoutPage />}
      {currentRoute === 'login' && <AuthPages mode="login" />}
      {currentRoute === 'register' && <AuthPages mode="register" />}
      {currentRoute === 'forgot-password' && <AuthPages mode="forgot" />}
      {currentRoute === 'customer-dashboard' && <CustomerDashboardPage />}
      {currentRoute === 'admin-dashboard' && <AdminDashboardPage />}
      {currentRoute === 'about' && <AboutPage />}
      {currentRoute === 'contact' && <ContactPage />}
      {currentRoute === 'faq' && <FAQPage />}
      {currentRoute === 'privacy' && <LegalPages type="privacy" />}
      {currentRoute === 'terms' && <LegalPages type="terms" />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-[#0c0d10] text-[#e5e7eb] font-['Vazirmatn',sans-serif] selection:bg-[#d4af37]/30 selection:text-white">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
        <MobileBottomNav />
        <NotificationToast />
      </div>
    </AppProvider>
  );
}
