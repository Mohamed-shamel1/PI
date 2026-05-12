import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  List,
  Truck,
  Tag,
  Settings,
  LogOut, 
  UtensilsCrossed,
  X
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
      active
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-orange-500'}`} />
    <span className="font-black text-sm uppercase tracking-widest rtl:text-xs">{label}</span>
  </Link>
);

export const AdminSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuthStore();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const menuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.sidebar.dashboard') },
    { to: '/admin/products', icon: Package, label: t('admin.sidebar.products') },
    { to: '/admin/categories', icon: List, label: t('admin.sidebar.categories') },
    { to: '/admin/orders', icon: ShoppingCart, label: t('admin.sidebar.orders') },
    { to: '/admin/users', icon: Users, label: t('admin.sidebar.users') },
    { to: '/admin/logistics', icon: Truck, label: t('admin.sidebar.logistics') },
    { to: '/admin/coupons', icon: Tag, label: t('admin.sidebar.coupons') },
    { to: '/admin/settings', icon: Settings, label: t('admin.sidebar.settings') },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300 w-72 border-slate-800 border-e">
      {/* Branding */}
      <div className="h-24 flex items-center justify-between px-8 border-b border-slate-800">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-white block leading-none">FOODPI</span>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{t('common.admin')}</span>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest rtl:text-xs">{t('common.logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`fixed top-0 bottom-0 z-50 hidden lg:block ${isRTL ? 'right-0' : 'left-0'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Slide Over) */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 z-[70] lg:hidden ${isRTL ? 'right-0' : 'left-0'}`}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
