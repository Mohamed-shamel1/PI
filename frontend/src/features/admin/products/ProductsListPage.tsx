import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminProducts, useDeleteProduct, useToggleProductAvailability } from './useAdminProducts';
import { useAdminCategories } from '../categories/useAdminCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2, 
  Package, 
  Filter, 
  Power, 
  PowerOff,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';

export const ProductsListPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const { data: products = [], isLoading } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProductAvailability();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = i18n.language === 'ar' ? product.name.ar : product.name.en;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter, i18n.language]);

  if (isLoading) return (
    <div className="p-12 space-y-8 animate-pulse font-black text-gray-300">
       <div className="h-12 w-64 bg-gray-100 rounded-2xl" />
       <div className="h-[500px] bg-white rounded-[3rem] border border-gray-50 shadow-sm" />
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">
            {t('admin.sidebar.products')} <span className="text-orange-500">{t('common.admin')}</span>
          </h1>
          <p className="text-gray-500 font-bold mt-1 rtl:text-xs">
            {t('admin.found_items', { count: filteredProducts.length }) || `Found ${filteredProducts.length} items`}
          </p>
        </div>
        
      <div className="flex flex-col gap-4">
          <div className="relative group w-full sm:min-w-[280px] sm:w-auto">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors rtl:scale-x-[-1]" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.placeholders.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-100 focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl ps-12 pe-4 py-2.5 text-sm font-bold shadow-sm transition-all w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border-gray-100 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 cursor-pointer text-start flex-1 sm:flex-none"
          >
            <option value="ALL">{t('menu.all_items')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {i18n.language === 'ar' ? cat.name.ar : cat.name.en}
              </option>
            ))}
          </select>

          <Link
            to="/admin/products/new"
            className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95 flex-1 sm:flex-none justify-center"
          >
            <Plus size={16} /> {t('admin.actions.add')}
          </Link>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full border-collapse text-start responsive-table">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400">
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.name')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.sidebar.categories')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.price')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.status')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-end whitespace-nowrap">{t('admin.table.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((product: any) => (
                  <motion.tr 
                    layout
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl.startsWith('/uploads') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors rtl:text-sm">
                            {i18n.language === 'ar' ? product.name.ar : product.name.en}
                          </h4>
                          <p className="text-xs text-gray-400 font-bold truncate max-w-[200px] rtl:text-[10px]">
                            {i18n.language === 'ar' ? product.description?.ar : product.description?.en}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {i18n.language === 'ar' ? product.category?.name.ar : product.category?.name.en}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-0.5 font-black text-gray-900 rtl:flex-row-reverse rtl:justify-end">
                          <span className="text-orange-500 text-xs font-bold uppercase ms-1">{t('common.currency')}</span>
                          {Number(product.salePrice) > 0 ? product.salePrice : product.price}
                        </div>
                        {product.discountType !== 'NONE' && (
                          <span className="text-[10px] font-bold text-gray-400 line-through">
                            {product.price} {t('common.currency')}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                       <button
                        onClick={() => toggleMutation.mutate(product)}
                        disabled={toggleMutation.isPending}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          product.isAvailable 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {toggleMutation.isPending && toggleMutation.variables?.id === product.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          product.isAvailable ? t('admin.status.ACTIVE') : t('admin.status.BLOCKED')
                        )}
                      </button>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-end whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(t('admin.notifications.confirm_delete'))) deleteMutation.mutate(product.id);
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === product.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
