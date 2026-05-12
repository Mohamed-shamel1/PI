import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, User, LogOut, UtensilsCrossed, Menu as MenuIcon, ClipboardList, X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { useCartStore } from '../../features/cart/cartStore';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomerNavbar = () => {

  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-orange-500 p-1.5 md:p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-200">
              <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-gray-900">
              FOOD<span className="text-orange-500">PI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 me-4 border-e pe-4 border-gray-100">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all">
              <MenuIcon className="w-4 h-4" />
              {t('nav.menu')}
            </Link>
            {user && (
              <Link to="/orders" className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all">
                <ClipboardList className="w-4 h-4" />
                {t('nav.my_orders')}
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher />

            <Link to="/cart" className="relative p-2 md:p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all group">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 end-1 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2 border-s ps-4 border-gray-100">
                <Link to="/settings" className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm overflow-hidden group-hover:text-orange-500 transition-colors">
                    {user.avatar ? (
                      <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-bold text-xs text-gray-900 leading-tight">{user.name}</span>
                </Link>
                <button onClick={logout} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all" title={t('common.logout')}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-flex bg-gray-900 text-white px-5 py-2 rounded-2xl font-bold text-sm hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-200 transition-all active:scale-95">
                {t('common.login')}
              </Link>
            )}

            {/* Hamburger – mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 start-0 end-0 bg-white rounded-t-[2rem] z-[70] md:hidden pb-safe"
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />

              <div className="px-6 pb-8 space-y-2">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-black text-gray-900">FOOD<span className="text-orange-500">PI</span></span>
                  <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <MobileNavLink to="/" icon={<MenuIcon size={18} />} label={t('nav.menu')} onClick={() => setMobileOpen(false)} />
                {user && <MobileNavLink to="/orders" icon={<ClipboardList size={18} />} label={t('nav.my_orders')} onClick={() => setMobileOpen(false)} />}
                {user && <MobileNavLink to="/cart" icon={<ShoppingBag size={18} />} label={`${t('common.cart')} (${cartCount})`} onClick={() => setMobileOpen(false)} />}

                <div className="h-px bg-gray-100 my-3" />

                {user ? (
                  <div className="space-y-2">
                    <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-2xl cursor-pointer">
                      <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black overflow-hidden shadow-sm">
                        {user.avatar ? (
                          <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{t('admin.status.USER')}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 rtl:rotate-180" />
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all"
                    >
                      <span className="flex items-center gap-2"><LogOut size={16} /> {t('common.logout')}</span>
                      <ChevronRight size={16} className="rtl:rotate-180" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full bg-gray-900 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-orange-500 transition-all active:scale-95"
                  >
                    {t('common.login')}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileNavLink = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-orange-50 hover:text-orange-600 text-gray-700 font-bold text-sm transition-all group"
  >
    <span className="flex items-center gap-3">{icon}{label}</span>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 rtl:rotate-180" />
  </Link>
);


