import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';
import SessionTimeout from './components/SessionTimeout';
import WhatsAppWidget from './components/WhatsAppWidget';
import SeoMeta from './components/SeoMeta';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetail from './pages/products/ProductDetail';
import CategoriesPage from './pages/categories/CategoriesPage';
import CatalogsPage from './pages/catalogs/CatalogsPage';
import AboutPage from './pages/about/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import DashboardOverview from './components/dashboard/DashboardOverview';
import DashboardProducts from './components/dashboard/DashboardProducts';
import DashboardOrders from './components/dashboard/DashboardOrders';
import DashboardQuotes from './components/dashboard/DashboardQuotes';
import DashboardShipments from './components/dashboard/DashboardShipments';
import DashboardFavorites from './components/dashboard/DashboardFavorites';
import DashboardProfile from './components/dashboard/DashboardProfile';
import DashboardSettings from './components/dashboard/DashboardSettings';
import DashboardCart from './components/dashboard/DashboardCart';
import DashboardMessages from './components/dashboard/DashboardMessages';
// Supplier Dashboard Components (integrated into user dashboard)
import SupplierMyProducts from './components/dashboard/SupplierMyProducts';
import SupplierProductForm from './components/dashboard/SupplierProductForm';
import SupplierBusinessProfile from './components/dashboard/SupplierBusinessProfile';
import NotificationsPage from './components/dashboard/NotificationsPage';
import CartPage from './pages/cart/CartPage';
import { CheckoutPage, CheckoutSuccessPage } from './pages/checkout';

function App() {
  return (
    <>
      <SplashScreen />
      <SessionTimeout />
      <ScrollToTop />
      <SeoMeta />
      <WhatsAppWidget />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="catalogs" element={<CatalogsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        {/* Auth routes without layout */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* Checkout route (protected, outside main layout) */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />

        {/* Checkout success route (for Stripe redirect) */}
        <Route path="/checkout/success" element={
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        } />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="quotes" element={<DashboardQuotes />} />
          <Route path="shipments" element={<DashboardShipments />} />
          <Route path="favorites" element={<DashboardFavorites />} />
          <Route path="cart" element={<DashboardCart />} />
          <Route path="messages" element={<DashboardMessages />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="notifications" element={<NotificationsPage />} />

          {/* Supplier-specific routes within user dashboard */}
          <Route path="my-products" element={<SupplierMyProducts />} />
          <Route path="my-products/create" element={<SupplierProductForm />} />
          <Route path="my-products/edit/:id" element={<SupplierProductForm />} />
          <Route path="business-profile" element={<SupplierBusinessProfile />} />
        </Route>

        {/* Supplier Dashboard routes (Legacy - redirect to unified dashboard) */}
        <Route path="/supplier/*" element={<Navigate to="/dashboard" replace />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
