import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister } from './useRegister';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Utensils, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-orange-500/5 overflow-hidden flex flex-col md:flex-row-reverse"
      >
        {/* Visual Side */}
        <div className="hidden md:flex md:w-1/2 bg-gray-900 relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" 
              alt="Food" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Join the<br />Food Community
            </h2>
            <p className="text-gray-300 text-lg">
              Create an account to start ordering your favorite meals and track them in real-time.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-white font-bold">
              <CheckCircle2 className="text-orange-500 w-5 h-5" />
              Real-time tracking
            </div>
            <div className="flex items-center gap-3 text-white font-bold">
              <CheckCircle2 className="text-orange-500 w-5 h-5" />
              Exclusive discounts
            </div>
            <div className="flex items-center gap-3 text-white font-bold">
              <CheckCircle2 className="text-orange-500 w-5 h-5" />
              Easy checkout
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">{t('common.register')}</h2>
            <p className="text-gray-500">{t('auth.register_subtitle') || 'Create your account in seconds.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {t('auth.name')}
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {t('auth.email')}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {t('auth.password')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-orange-500 text-white py-4 mt-4 rounded-2xl font-black text-lg hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
            >
              {registerMutation.isPending ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('common.register')
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            {t('auth.already_have_account')}{' '}
            <Link to="/login" className="text-orange-600 font-black hover:underline">
              {t('common.login')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
