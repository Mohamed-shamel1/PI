import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from './cartStore';

export const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { items, updateQty, removeItem, getTotal } = useCartStore();

  const getLocalized = (field: any) => (i18n.language === 'ar' ? field.ar : field.en);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('cart.empty')}</h1>
        <Link to="/" className="text-orange-500 font-bold flex items-center justify-center gap-2">
          {i18n.language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {t('cart.order_now') || 'Order Now'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8 rtl:text-2xl">{t('cart.title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-50 flex gap-6">
              <img
                src={item.product.imageUrl?.startsWith('/uploads') ? `http://localhost:5000${item.product.imageUrl}` : item.product.imageUrl}
                alt={getLocalized(item.product.name)}
                className="w-24 h-24 object-cover rounded-2xl shadow-inner"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-xl text-gray-900 rtl:text-lg">{getLocalized(item.product.name)}</h3>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl p-2 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-orange-600 font-black mb-4">
                  {Number(item.product.salePrice) > 0 ? item.product.salePrice : item.product.price} {t('common.currency')}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black w-8 text-center text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 h-fit sticky top-24">
          <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-4 rtl:text-lg">{t('cart.total')}</h2>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Balance</p>
              <p className="text-4xl font-black text-orange-500 tracking-tighter">
                {getTotal()} <span className="text-lg text-white/50 font-bold">{t('common.currency')}</span>
              </p>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            {t('cart.checkout')}
            <div className="rtl:rotate-180 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
