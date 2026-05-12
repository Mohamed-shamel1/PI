import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronRight, 
  Menu, 
  User, 
  Bell,
  Search,
  ChevronLeft
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const AdminHeader = ({ onOpenSidebar }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  // Localized Breadcrumb logic
  const paths = location.pathname.split('/').filter(p => p && p !== 'admin');
  const breadcrumbItems = paths.map((path, index) => {
    // Try to find a translation in the sidebar namespace
    const label = t(`admin.sidebar.${path}`) !== `admin.sidebar.${path}` 
      ? t(`admin.sidebar.${path}`) 
      : path.charAt(0).toUpperCase() + path.slice(1);

    return {
      label,
      href: `/admin/${paths.slice(0, index + 1).join('/')}`
    };
  });

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <Link to="/admin" className="text-gray-400 hover:text-orange-500 font-bold transition-colors">
            {t('common.home')}
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight size={14} className="text-gray-300 rtl:rotate-180" />
          )}
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center gap-2">
              <span className={`font-black tracking-tight ${index === breadcrumbItems.length - 1 ? 'text-gray-900' : 'text-gray-400'} rtl:text-xs`}>
                {item.label}
              </span>
              {index < breadcrumbItems.length - 1 && (
                <ChevronRight size={14} className="text-gray-300 rtl:rotate-180" />
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex relative group">
          <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors rtl:scale-x-[-1]" />
          <input 
            type="text" 
            placeholder={t('admin.placeholders.search')}
            className="bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl ps-12 pe-4 py-2.5 text-sm font-medium transition-all w-64 text-start"
          />
        </div>

        <div className="h-8 w-px bg-gray-100 mx-2" />

        <LanguageSwitcher />

        <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 end-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 ps-2">
          <div className="text-end hidden lg:block">
            <p className="text-sm font-black text-gray-900 leading-none mb-1">{user?.name}</p>
            <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider">{t('admin.status.ADMIN')}</p>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 overflow-hidden ring-2 ring-white">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
