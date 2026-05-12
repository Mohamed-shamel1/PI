import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from './useMenu';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Filter } from 'lucide-react';

export const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const { categories, products, isLoading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getLocalized = (field: any) => (i18n.language === 'ar' ? field.ar : field.en);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory ? p.categoryId === activeCategory : true;
      const matchesSearch = getLocalized(p.name).toLowerCase().includes(searchQuery.toLowerCase()) || 
                           getLocalized(p.description || {}).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery, i18n.language]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="h-64 bg-gray-200/50 rounded-[2.5rem] animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Hero Section */}
      <section className="relative h-[280px] sm:h-[380px] md:h-[450px] flex items-end sm:items-center overflow-hidden bg-gray-900 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl shadow-gray-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
            alt="Hero"
            className="w-full h-full object-cover opacity-70 scale-105"
          />
        </div>

        <div className="container mx-auto px-4 pb-8 sm:pb-0 relative z-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-black mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4" />
              {t('menu.hero_badge') || 'BEST FOOD IN TOWN'}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] rtl:text-3xl sm:rtl:text-4xl"
            >
              {t('menu.hero_title_1')}<br />
              <span className="text-orange-500 italic drop-shadow-lg">
                {t('menu.hero_title_2')}
              </span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative max-w-lg group"
            >
              <Search className="absolute start-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors w-6 h-6 rtl:scale-x-[-1]" />
              <input 
                type="text"
                placeholder={t('menu.search_placeholder') || 'Search for your favorite food...'}
                className="w-full ps-14 pe-6 py-5 rounded-3xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:bg-white focus:text-gray-900 transition-all backdrop-blur-xl text-lg shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky Category Bar */}
      <div className="sticky top-20 z-40 bg-[#f8fafc]/80 backdrop-blur-md py-6 border-b border-gray-100 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2 px-4 border-e border-gray-200 me-2 text-gray-400 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">{t('menu.categories')}</span>
            </div>
            
            <CategoryPill 
              active={activeCategory === null} 
              label={t('menu.all_items') || 'All Items'} 
              onClick={() => setActiveCategory(null)} 
            />
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                active={activeCategory === cat.id}
                label={getLocalized(cat.name)}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Search className="w-10 h-10 text-orange-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{t('menu.no_results_title')}</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-lg">{t('menu.no_results_desc')}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const CategoryPill = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all whitespace-nowrap border-2 ${
      active
        ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-200'
        : 'bg-white border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-900 shadow-sm'
    }`}
  >
    {label}
  </motion.button>
);
