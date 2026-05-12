import { useState } from 'react';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from './useAdminCoupons';
import { Ticket, Plus, Trash2, Edit2, CheckCircle2, X, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
export const CouponsPage = () => {
  const { t, i18n } = useTranslation();
  const { data: coupons, isLoading } = useAdminCoupons();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();
  const isRTL = i18n.language === 'ar';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    expiryDate: format(new Date(), 'yyyy-MM-dd'),
    usageLimit: '',
    isActive: true
  });

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiryDate: format(new Date(coupon.expiryDate), 'yyyy-MM-dd'),
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue.toString()),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit.toString()) : null
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, ...payload }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({
            code: '',
            discountType: 'PERCENTAGE',
            discountValue: 0,
            expiryDate: format(new Date(), 'yyyy-MM-dd'),
            usageLimit: '',
            isActive: true
          });
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
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">{t('admin.sidebar.coupons')}</h1>
            <p className="text-gray-400 font-bold text-sm rtl:text-xs">{t('admin.coupons_desc') || 'Manage discount codes and promotional campaigns'}</p>
          </div>
        </div>

        <button
          onClick={() => { setEditingCoupon(null); setIsModalOpen(true); }}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-orange-200 flex items-center gap-2 hover:bg-orange-600 transition-all"
        >
          <Plus size={20} />
          {t('admin.actions.add')}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-x-auto no-scrollbar">
        <table className="w-full text-start">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start">{t('admin.table.code')}</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start">{t('admin.table.discount')}</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start">{t('admin.table.expiry')}</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start">{t('admin.table.usage') || 'Usage'}</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start">{t('admin.table.status')}</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start">{t('admin.table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons?.map((coupon: any) => (
              <tr key={coupon.id} className="group hover:bg-orange-50/30 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600 font-black text-xs uppercase tracking-tighter">
                      {coupon.code}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-black text-gray-900 rtl:text-sm">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue} ${t('common.currency')}`}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-sm rtl:text-xs">
                    <Calendar size={14} />
                    {format(new Date(coupon.expiryDate), i18n.language === 'ar' ? 'dd MMM, yyyy' : 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-sm rtl:text-xs">{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                    <div className="w-24 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                       <div 
                        className="h-full bg-orange-500" 
                        style={{ width: `${coupon.usageLimit ? (coupon.usedCount / coupon.usageLimit) * 100 : 0}%` }} 
                       />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                   }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      {coupon.isActive ? t('admin.status.ACTIVE') : t('admin.status.BLOCKED')}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(coupon)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => {
                      if (window.confirm(t('admin.notifications.confirm_delete'))) deleteMutation.mutate(coupon.id);
                    }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 rtl:text-xl">
                  {editingCoupon ? t('admin.actions.edit') : t('admin.actions.add')} {t('admin.sidebar.coupons')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.code')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER50"
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-black uppercase transition-all text-start"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.role')}</label>
                    <select
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all appearance-none text-start"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="PERCENTAGE">{t('admin.percentage') || 'Percentage (%)'}</option>
                      <option value="FIXED">{t('admin.fixed_amount') || 'Fixed Amount ($)'}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.price')}</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.expiry')}</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.usage')}</label>
                    <input
                      type="number"
                      placeholder={t('admin.placeholders.unlimited') || 'Unlimited'}
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="text-sm font-black text-gray-900 rtl:text-xs">{t('admin.status.available_for_customers') || 'Active and available for customers'}</label>
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Tag size={24} />
                  {editingCoupon ? t('admin.actions.save') : t('admin.actions.add')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
