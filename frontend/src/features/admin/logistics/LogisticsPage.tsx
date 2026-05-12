import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminLogistics, useCreateZone, useUpdateZone, useDeleteZone } from './useAdminLogistics';
import { Plus, MapPin, Edit2, Trash2, X, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LogisticsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { data: zones, isLoading } = useAdminLogistics();
  const createMutation = useCreateZone();
  const updateMutation = useUpdateZone();
  const deleteMutation = useDeleteZone();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', deliveryFee: 0 });

  const handleEdit = (zone: any) => {
    setEditingZone(zone);
    setFormData({ name: zone.name, deliveryFee: zone.deliveryFee });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateMutation.mutate({ id: editingZone.id, ...formData }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ name: '', deliveryFee: 0 });
        }
      });
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">{t('admin.sidebar.delivery_zones')}</h1>
            <p className="text-gray-400 font-bold text-sm rtl:text-xs">{t('admin.logistics_desc') || 'Manage service areas and delivery prices'}</p>
          </div>
        </div>

        <button
          onClick={() => { setEditingZone(null); setFormData({ name: '', deliveryFee: 0 }); setIsModalOpen(true); }}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-orange-200 flex items-center gap-2 hover:bg-orange-600 transition-all"
        >
          <Plus size={20} />
          {t('admin.actions.add')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {zones?.map((zone: any) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={zone.id}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-500 rtl:ms-0">
                   <MapPin size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(zone)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => {
                    if (window.confirm(t('admin.notifications.confirm_delete'))) deleteMutation.mutate(zone.id);
                  }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1 rtl:text-lg">{zone.name}</h3>
              <div className="flex items-center gap-1.5 text-orange-600 font-black rtl:flex-row-reverse rtl:justify-end">
                 <span className="text-2xl tracking-tighter">{zone.deliveryFee}</span>
                 <span className="text-sm uppercase font-bold">{t('common.currency')}</span>
                 <span className="text-[10px] text-gray-400 uppercase tracking-widest ms-1">{t('admin.delivery_fee') || 'Delivery Fee'}</span>
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-md p-10 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 rtl:text-xl">{editingZone ? t('admin.actions.edit') : t('admin.actions.add')} {t('admin.sidebar.delivery_zones')}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.name')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('admin.placeholders.zone_name') || 'e.g. Downtown'}
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.price')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} />
                  {editingZone ? t('admin.actions.save') : t('admin.actions.add')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
