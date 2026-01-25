import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy load admin/delivery layouts/pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminAddProductPage = lazy(() => import('./pages/admin/AdminAddProductPage'));
const AdminEditProductPage = lazy(() => import('./pages/admin/AdminEditProductPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

const UserOrdersPage = lazy(() => import('./pages/UserOrdersPage'));
// Placeholder for now, creating next
const DeliveryDashboardPage = lazy(() => import('./pages/delivery/DeliveryDashboardPage'));
const DeliveryProfilePage = lazy(() => import('./pages/delivery/DeliveryProfilePage'));
const DeliveryHistoryPage = lazy(() => import('./pages/delivery/DeliveryHistoryPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);



function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmed" element={<OrderSuccessPage />} />
                <Route path="/my-orders" element={<UserOrdersPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<AdminAddProductPage />} />
                  <Route path="products/edit/:id" element={<AdminEditProductPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  {/* Add more admin routes here */}
                </Route>
              </Route>

              {/* Delivery Routes */}
              <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
                <Route path="/delivery" element={<DashboardLayout />}>
                  <Route index element={<DeliveryDashboardPage />} />
                  <Route path="profile" element={<DeliveryProfilePage />} />
                  <Route path="history" element={<DeliveryHistoryPage />} />
                </Route>
              </Route>

            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
