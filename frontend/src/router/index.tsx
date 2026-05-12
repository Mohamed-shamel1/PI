import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../components/shared/ProtectedRoute';
import { AuthWrapper } from '../components/shared/AuthWrapper';
import { MenuPage } from '../features/menu/MenuPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { SettingsPage } from '../features/auth/SettingsPage';
import { CartPage } from '../features/cart/CartPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { OrdersPage } from '../features/orders/OrdersPage';
import { OrderTrackingPage } from '../features/orders/OrderTrackingPage';
import { DashboardPage } from '../features/admin/dashboard/DashboardPage';
import { ProductsListPage } from '../features/admin/products/ProductsListPage';
import { ProductFormPage } from '../features/admin/products/ProductFormPage';
import { AdminOrdersPage } from '../features/admin/orders/AdminOrdersPage';
import { AdminOrderDetailPage } from '../features/admin/orders/AdminOrderDetailPage';
import { UsersListPage } from '../features/admin/users/UsersListPage';
import { CategoriesListPage } from '../features/admin/categories/CategoriesListPage';
import { LogisticsPage } from '../features/admin/logistics/LogisticsPage';
import { CouponsPage } from '../features/admin/coupons/CouponsPage';
import { AdminLayout } from '../components/layout/AdminLayout';
import App from '../App';

export const router = createBrowserRouter([
  {
    element: <AuthWrapper />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          // Public Customer Routes
          {
            path: '/',
            element: <MenuPage />,
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
          
          // Customer Protected Routes
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: '/cart',
                element: <CartPage />,
              },
              {
                path: '/settings',
                element: <SettingsPage />,
              },
              {
                path: '/checkout',
                element: <CheckoutPage />,
              },
              {
                path: '/orders',
                element: <OrdersPage />,
              },
              {
                path: '/orders/:id',
                element: <OrderTrackingPage />,
              },
            ],
          },
        ],
      },
      
      // Dedicated Admin Experience (Strict Separation)
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
              },
              {
                path: 'dashboard',
                element: <DashboardPage />,
              },
              {
                path: 'products',
                element: <ProductsListPage />,
              },
              {
                path: 'products/new',
                element: <ProductFormPage />,
              },
              {
                path: 'products/:id/edit',
                element: <ProductFormPage />,
              },
              {
                path: 'orders',
                element: <AdminOrdersPage />,
              },
              {
                path: 'orders/:id',
                element: <AdminOrderDetailPage />,
              },
              {
                path: 'categories',
                element: <CategoriesListPage />,
              },
              {
                path: 'logistics',
                element: <LogisticsPage />,
              },
              {
                path: 'coupons',
                element: <CouponsPage />,
              },
              {
                path: 'users',
                element: <UsersListPage />,
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },

      // Fallback
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
