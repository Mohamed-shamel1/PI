import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminCategories, useUpsertCategory, useDeleteCategory } from './useAdminCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CategoriesListPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categories = [], isLoading } = useAdminCategories();
  const upsertMutation = useUpsertCategory();
  const deleteMutation = useDeleteCategory();

  const [formData, setFormData] = useState({
    name: { en: '', ar: '' },
    isActive: true
  });

  const handleOpenModal = (cat: any = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        isActive: cat.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: { en: '', ar: '' },
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(
      { id: editingCategory?.id, data: formData },
      {
        onSuccess: () => setIsModalOpen(false),
      }
    );
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat: any) => {
      const name = i18n.language === 'ar' ? cat.name.ar : cat.name.en;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery, i18n.language]);

  if (isLoading) return <div className="p-12 text-center animate-pulse font-black text-gray-300">LOADING DATABASE...</div>;

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">
            {t('admin.sidebar.categories')}
          </h1>
          <p className="text-gray-500 font-bold mt-1 rtl:text-xs">
            {t('admin.found_items', { count: filteredCategories.length }) || `Found ${filteredCategories.length} categories`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors rtl:scale-x-[-1]" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.placeholders.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-100 focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl ps-12 pe-4 py-2.5 text-sm font-bold shadow-sm transition-all w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 flex items-center gap-2"
          >
            <Plus size={16} /> {t('admin.actions.add')}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {filteredCategories.map((cat: any) => (
            <motion.div
              layout
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white p-8 rounded-[2.5rem] border ${cat.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/10'} shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all group relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 ${cat.isActive ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'} rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
                    <Layers size={28} />
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                    cat.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {cat.isActive ? t('admin.status.ACTIVE') : t('admin.status.BLOCKED')}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-2 truncate rtl:text-xl">
                  {i18n.language === 'ar' ? cat.name.ar : cat.name.en}
                </h3>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenModal(cat)}
                      className="p-2.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                       onClick={() => {
                        if (window.confirm(t('admin.notifications.confirm_delete'))) deleteMutation.mutate(cat.id);
                      }}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 rtl:text-xl">
                  {editingCategory ? t('admin.actions.edit') : t('admin.actions.add')} <span className="text-orange-500">{t('admin.sidebar.categories')}</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.name')} (EN)</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                      value={formData.name.en}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.name')} (AR)</label>
                    <input
                      type="text"
                      required
                      dir="rtl"
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all"
                      value={formData.name.ar}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                    {t('admin.table.status')}: {formData.isActive ? t('admin.status.ACTIVE') : t('admin.status.BLOCKED')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.isActive ? 'bg-orange-500' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isActive ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {upsertMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {editingCategory ? t('admin.actions.save') : t('admin.actions.add')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
