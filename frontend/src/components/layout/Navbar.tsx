import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, User, LogOut, UtensilsCrossed, LayoutDashboard, Package, ClipboardList, Menu } from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { useCartStore } from '../../features/cart/cartStore';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-200">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              FOOD<span className="text-orange-500">PI</span>
            </span>
          </Link>

          {/* Role-Based Main Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {isAdmin ? (
              <>
                <NavLink to="/admin/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label={t('nav.dashboard')} />
                <NavLink to="/admin/products" icon={<Package className="w-4 h-4" />} label={t('nav.products')} />
                <NavLink to="/admin/orders" icon={<ClipboardList className="w-4 h-4" />} label={t('nav.orders')} />
              </>
            ) : (
              <>
                <NavLink to="/" icon={<Menu className="w-4 h-4" />} label={t('nav.menu')} />
                {user && <NavLink to="/orders" icon={<ClipboardList className="w-4 h-4" />} label={t('nav.my_orders')} />}
              </>
            )}
          </nav>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />

          {!isAdmin && (
            <Link to="/cart" className="relative p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all group">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 border-s ps-4 border-gray-100">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm group-hover:text-orange-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-bold text-xs text-gray-900 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title={t('common.logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-200 transition-all active:scale-95"
            >
              {t('common.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
  >
    {icon}
    {label}
  </Link>
);
