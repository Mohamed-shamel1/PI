import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useUpsertProduct, useAdminProducts } from './useAdminProducts';
import { useAdminCategories } from '../categories/useAdminCategories';
import { motion } from 'framer-motion';
import { Save, X, Package, DollarSign, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const ProductFormPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categories, isLoading: isCatsLoading } = useAdminCategories();
  const { data: products } = useAdminProducts();
  const upsertMutation = useUpsertProduct();

  const [formData, setFormData] = useState({
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    price: 0,
    categoryId: '',
    imageUrl: '',
    isAvailable: true,
    discountType: 'NONE',
    discountValue: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id && products) {
      const product = products.find((p) => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description || { en: '', ar: '' },
          price: Number(product.price),
          categoryId: product.categoryId,
          imageUrl: product.imageUrl || '',
          isAvailable: product.isAvailable,
          discountType: product.discountType  || 'NONE',
          discountValue: Number(product.discountValue || 0),
        });
        if (product.imageUrl) {
          setImagePreview(product.imageUrl.startsWith('/uploads') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl);
        }
      }
    }
  }, [id, products]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error(t('admin.notifications.error_category_required') || 'Please select a category');
      return;
    }

    const payload = new FormData();
    payload.append('name', JSON.stringify(formData.name));
    payload.append('description', JSON.stringify(formData.description));
    payload.append('price', formData.price.toString());
    payload.append('categoryId', formData.categoryId);
    payload.append('isAvailable', formData.isAvailable.toString());
    payload.append('discountType', formData.discountType);
    payload.append('discountValue', formData.discountValue.toString());
    
    if (imageFile) {
      payload.append('image', imageFile);
    } else if (formData.imageUrl) {
      payload.append('imageUrl', formData.imageUrl);
    }

    upsertMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => navigate('/admin/products'),
      }
    );
  };

  if (isCatsLoading) return <div className="p-12 text-center animate-pulse font-black text-gray-400">{t('common.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">
          {id ? t('admin.actions.edit') : t('admin.actions.add')} <span className="text-orange-500">{t('admin.sidebar.products')}</span>
        </h1>
        <button 
          onClick={() => navigate('/admin/products')}
          className="text-gray-400 hover:text-gray-900 font-bold flex items-center gap-2 transition-colors rtl:text-xs"
        >
          <X size={20} className="rtl:scale-x-[-1]" /> {t('admin.actions.cancel')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2 rtl:flex-row-reverse rtl:justify-end">
              <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Package size={18} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest rtl:text-xs">{t('admin.general_info') || 'General Information'}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.name')} (EN)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Double Cheeseburger"
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
                  placeholder="دبل تشيز برجر"
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all"
                  value={formData.name.ar}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.description') || 'Description'} (EN)</label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all resize-none text-start"
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.table.description') || 'Description'} (AR)</label>
                <textarea
                  rows={4}
                  dir="rtl"
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all resize-none"
                  value={formData.description.ar}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.sidebar.categories')}</label>
              <select
                required
                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all appearance-none cursor-pointer text-start"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">{t('admin.placeholders.category_select')}</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{i18n.language === 'ar' ? cat.name.ar : cat.name.en}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Discounts */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
             <div className="flex items-center gap-3 mb-2 rtl:flex-row-reverse rtl:justify-end">
                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign size={18} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest rtl:text-xs">{t('admin.pricing_discounts') || 'Pricing & Discounts'}</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.base_price') || 'Base Price'}</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all text-start"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.discount_type') || 'Discount Type'}</label>
                  <select
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all appearance-none cursor-pointer text-start"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="NONE">{t('admin.no_discount') || 'No Discount'}</option>
                    <option value="PERCENTAGE">{t('admin.percentage') || 'Percentage (%)'}</option>
                    <option value="FIXED">{t('admin.fixed_amount') || 'Fixed Amount'}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1">{t('admin.discount_value') || 'Discount Value'}</label>
                  <input
                    type="number"
                    disabled={formData.discountType === 'NONE'}
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-6 py-4 font-bold transition-all disabled:opacity-30 text-start"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  />
                </div>
             </div>

             {/* Live Preview Card */}
             <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between rtl:flex-row-reverse">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest rtl:text-[9px]">{t('admin.final_price_preview') || 'Final Sale Price Preview'}</p>
                  <div className="flex items-center gap-3 mt-1 rtl:flex-row-reverse rtl:justify-end">
                    <span className="text-3xl font-black text-slate-900 rtl:text-2xl">
                      {formData.discountType === 'NONE' 
                        ? formData.price 
                        : formData.discountType === 'PERCENTAGE' 
                          ? (formData.price - (formData.price * (formData.discountValue / 100))).toFixed(2)
                          : Math.max(0, formData.price - formData.discountValue).toFixed(2)
                      } <span className="text-sm font-bold text-slate-500">{t('common.currency')}</span>
                    </span>
                    {formData.discountType !== 'NONE' && (
                      <span className="text-sm font-bold text-slate-400 line-through mt-2">{formData.price} {t('common.currency')}</span>
                    )}
                  </div>
                </div>
                {formData.discountType !== 'NONE' && (
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black rtl:text-[10px]">
                    {formData.discountType === 'PERCENTAGE' ? `${t('admin.save')} ${formData.discountValue}%` : `${t('admin.save')} ${formData.discountValue} ${t('common.currency')}`}
                  </div>
                )}
             </div>
          </div>

        </div>

        <div className="space-y-8">
           {/* Image & Status */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ms-1 flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                  <ImageIcon size={14} /> {t('common.upload_image') || 'Upload Image'}
                </label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-all overflow-hidden relative group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-white group-hover:text-orange-500 transition-colors">
                        <ImageIcon size={24} />
                      </div>
                      <span className="text-xs font-bold text-gray-400">Click to upload image (Max 2MB)</span>
                    </>
                  )}
                  {imagePreview && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-xl">Change Image</span>
                     </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="h-px bg-gray-50 my-2" />

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-black text-gray-900 rtl:text-xs">{t('admin.visibility') || 'Visibility'}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isAvailable ? 'bg-orange-500' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isAvailable ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
                </button>
              </div>
           </div>

           {/* Submit Button */}
           <button
             type="submit"
             disabled={upsertMutation.isPending}
             className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 hover:shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 rtl:text-base"
           >
             {upsertMutation.isPending ? (
               <Loader2 className="animate-spin" />
             ) : (
               <Save size={24} className="rtl:scale-x-[-1]" />
             )}
             {id ? t('admin.actions.save') : t('admin.actions.add')}
           </button>
        </div>
      </form>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin h-5 w-5 text-current ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
