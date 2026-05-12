import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../cart/cartStore';
import { useCheckout } from './useCheckout';
import { useAddresses, useCreateAddress } from '../addresses/useAddresses';
import { useZones } from '../../hooks/useZones';
import { CreditCard, Truck, Tag, Receipt, MessageSquare, MapPin, CheckCircle2, Plus, X, Loader2, Home, Building } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const { getTotal } = useCartStore();
  const checkoutMutation = useCheckout();
  const { data: savedAddresses, isLoading: isAddrLoading } = useAddresses();
  const { data: zones } = useZones();
  const createAddressMutation = useCreateAddress();

  const [formData, setFormData] = useState({
    addressId: '',
    address: {
      street: '',
      city: 'Cairo',
      zoneId: '',
      buildingNumber: ''
    },
    paymentMethod: 'CASH_ON_DELIVERY',
    notes: '',
    couponCode: '',
  });

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const subtotal = getTotal();

  // Find selected address to get delivery fee
  const selectedAddress = useMemo(() => {
    return savedAddresses?.find((a: any) => a.id === formData.addressId);
  }, [savedAddresses, formData.addressId]);

  // Find zone for new address form to get preview fee
  const selectedZone = useMemo(() => {
    if (formData.addressId) return selectedAddress?.zone;
    return zones?.find((z: any) => z.id === formData.address.zoneId);
  }, [zones, formData.address.zoneId, formData.addressId, selectedAddress]);

  const deliveryFee = selectedZone?.deliveryFee || 0;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      return subtotal * (Number(appliedCoupon.discountValue) / 100);
    }
    return Math.min(subtotal, Number(appliedCoupon.discountValue));
  }, [appliedCoupon, subtotal]);

  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const response = await api.get(`/coupons/validate/${couponInput.trim()}`);
      setAppliedCoupon(response.data.data.coupon);
      setFormData({ ...formData, couponCode: couponInput.trim() });
      toast.success(i18n.language === 'ar' ? 'تم تطبيق الكود بنجاح!' : 'Coupon applied successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    createAddressMutation.mutate(formData.address, {
      onSuccess: (newAddr) => {
        setFormData({ ...formData, addressId: newAddr.id });
        setShowNewAddressForm(false);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.addressId) {
      toast.error('Please select or add a delivery address');
      return;
    }
    checkoutMutation.mutate(formData);
  };

  if (isAddrLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-10">
        <Receipt className="w-8 h-8 text-orange-500" />
        <h1 className="text-4xl font-black text-gray-900 tracking-tight rtl:text-3xl">{t('checkout.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Address Selection */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex items-center gap-3 text-gray-900 rtl:text-lg">
                <MapPin className="w-6 h-6 text-orange-500" />
                {t('checkout.delivery_address')}
              </h2>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(true)}
                className="text-orange-500 font-black text-sm flex items-center gap-1 hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={16} />
                {t('checkout.add_new_address')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses?.map((addr: any) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, addressId: addr.id })}
                  className={`p-5 rounded-3xl border-2 text-start transition-all relative ${
                    formData.addressId === addr.id
                      ? 'border-orange-500 bg-orange-50/20'
                      : 'border-gray-50 hover:border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Home className={formData.addressId === addr.id ? 'text-orange-500' : 'text-gray-400'} size={18} />
                    <span className="font-black text-gray-900">{addr.city}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mb-2">{addr.street}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-0.5 rounded-lg">
                      {addr.zone?.name}
                    </span>
                    <span className="text-xs font-black text-gray-900">
                      {addr.zone?.deliveryFee} {t('common.currency')}
                    </span>
                  </div>
                  {formData.addressId === addr.id && (
                    <CheckCircle2 className="absolute top-4 end-4 text-orange-500" size={18} />
                  )}
                </button>
              ))}
            </div>

            {savedAddresses?.length === 0 && !showNewAddressForm && (
              <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">{t('checkout.no_addresses') || 'No saved addresses found.'}</p>
                <button 
                  type="button" 
                  onClick={() => setShowNewAddressForm(true)}
                  className="mt-4 text-orange-500 font-black text-sm"
                >
                  {t('checkout.create_first') || 'Create your first one'}
                </button>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 rtl:text-lg">
              <CreditCard className="w-6 h-6 text-orange-500" />
              {t('checkout.payment_method')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all relative overflow-hidden ${
                  formData.paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-orange-500 bg-orange-50/30 text-orange-600'
                    : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                }`}
              >
                <Truck className={`w-8 h-8 ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-black text-sm uppercase tracking-wider rtl:text-xs">
                  {t('checkout.cod')}
                </span>
                {formData.paymentMethod === 'CASH_ON_DELIVERY' && <CheckCircle2 className="absolute top-4 end-4 w-5 h-5 text-orange-500" />}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'ONLINE_PAYMENT' })}
                className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all relative overflow-hidden ${
                  formData.paymentMethod === 'ONLINE_PAYMENT'
                    ? 'border-orange-500 bg-orange-50/30 text-orange-600'
                    : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                }`}
              >
                <CreditCard className={`w-8 h-8 ${formData.paymentMethod === 'ONLINE_PAYMENT' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-black text-sm uppercase tracking-wider rtl:text-xs">
                  {t('checkout.online_payment')}
                </span>
                {formData.paymentMethod === 'ONLINE_PAYMENT' && <CheckCircle2 className="absolute top-4 end-4 w-5 h-5 text-orange-500" />}
              </button>
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
             <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 rtl:text-lg">
              <MessageSquare className="w-6 h-6 text-orange-500" />
              {t('checkout.notes')}
            </h2>
            <textarea
              placeholder={t('checkout.notes_placeholder') || 'e.g. Doorbell doesn\'t work...'}
              className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-[2rem] px-8 py-6 font-bold transition-all min-h-[120px] outline-none text-start"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </section>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 sticky top-24">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 rtl:text-lg">
              <Receipt className="w-6 h-6 text-orange-500" />
              {t('checkout.summary')}
            </h2>
            
            <div className="mb-10 relative group">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder={t('checkout.promo_code')}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full bg-white/10 border-transparent focus:bg-white/20 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-white/30 text-start"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponInput}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-6 rounded-2xl transition-colors flex items-center justify-center"
                >
                  {isValidatingCoupon ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tag size={20} />}
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-black">
                  <CheckCircle2 size={14} />
                  <span>{appliedCoupon.code} {t('checkout.applied') || 'applied!'}</span>
                </div>
              )}
            </div>

            <div className="space-y-5 mb-12">
              <div className="flex justify-between items-center text-slate-400 text-sm font-bold">
                <span>{t('checkout.subtotal')}</span>
                <span className="text-white">{subtotal.toFixed(2)} {t('common.currency')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-400 text-sm font-bold">
                  <span className="flex items-center gap-1.5"><Tag size={14} /> {t('checkout.discount')}</span>
                  <span>-{discountAmount.toFixed(2)} {t('common.currency')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-400 text-sm font-bold">
                <span className="flex items-center gap-1.5"><Truck size={14} /> {t('checkout.delivery_fee')}</span>
                <span className={`text-white transition-all duration-500 ${deliveryFee > 0 ? 'scale-110 text-orange-500' : ''}`}>
                  {deliveryFee.toFixed(2)} {t('common.currency')}
                </span>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{t('checkout.final_amount') || 'Final Amount'}</p>
                  <p className="text-5xl font-black text-orange-500 tracking-tighter rtl:text-4xl">
                    {total.toFixed(2)} <span className="text-sm text-white/50">{t('common.currency')}</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={checkoutMutation.isPending || !formData.addressId}
              className="w-full bg-white text-slate-900 py-6 rounded-[2rem] font-black text-lg hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {checkoutMutation.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
              {t('checkout.confirm')}
            </button>
          </div>
        </div>
      </form>

      {/* New Address Modal */}
      <AnimatePresence>
        {showNewAddressForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewAddressForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-[3.5rem] w-full max-w-lg p-12 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 rtl:text-xl">{t('checkout.add_new_address')}</h2>
                </div>
                <button onClick={() => setShowNewAddressForm(false)} className="text-gray-400 hover:text-gray-600 p-2 transition-transform hover:rotate-90">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAddress} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ms-2">{t('checkout.zone')}</label>
                  <select
                    required
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-[1.5rem] px-6 py-4 font-bold transition-all appearance-none text-start"
                    value={formData.address.zoneId}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zoneId: e.target.value } })}
                  >
                    <option value="">{t('checkout.select_zone') || 'Select your area...'}</option>
                    {zones?.map((z: any) => (
                      <option key={z.id} value={z.id}>{z.name} ({z.deliveryFee} {t('common.currency')})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ms-2">{t('checkout.city')}</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-[1.5rem] px-6 py-4 font-bold transition-all text-start"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ms-2">{t('checkout.building_number')}</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-[1.5rem] px-6 py-4 font-bold transition-all text-start"
                      value={formData.address.buildingNumber}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, buildingNumber: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ms-2">{t('checkout.street')}</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-[1.5rem] px-6 py-4 font-bold transition-all resize-none text-start"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={createAddressMutation.isPending}
                  className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {createAddressMutation.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                  {t('common.save')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
