import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings, 
  LogOut, 
  User, 
  Bell,
  UtensilsCrossed
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

export const AdminNavbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 w-full border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/admin" className="flex items-center gap-2 group">
          <div className="bg-gray-900 p-1.5 rounded-lg">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">
            Admin<span className="text-orange-500">Panel</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <AdminNavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label={t('nav.dashboard')} />
          <AdminNavLink to="/admin/products" icon={<Package size={18} />} label={t('nav.products')} />
          <AdminNavLink to="/admin/orders" icon={<ClipboardList size={18} />} label={t('nav.orders')} />
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        
        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name}</p>
            <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider">System Administrator</p>
          </div>
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-sm border border-gray-800">
            <User size={20} />
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title={t('common.logout')}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

const AdminNavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
  >
    {icon}
    {label}
  </Link>
);
