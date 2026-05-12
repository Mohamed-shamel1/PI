import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios';
import { Order } from '../../../types/index';
import { useTranslation } from 'react-i18next';

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data.data.order as Order;
    },
    enabled: !!id,
  });

  if (isLoading || !order) return (
    <div className="p-8 flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">
          {t('admin.order_details') || 'Order Details'}: <span className="text-orange-500">#{order.id.slice(0, 8)}</span>
        </h1>
        <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
          order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {t(`admin.status.${order.status}`)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 rtl:text-xs">{t('admin.table.items')}</h3>
             <div className="space-y-4">
               {order.items.map((item) => (
                 <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                       <img src={item.product.imageUrl?.startsWith('/uploads') ? `http://localhost:5000${item.product.imageUrl}` : item.product.imageUrl} className="w-8 h-8 object-cover rounded-lg" alt="" />
                     </div>
                     <div className="text-start">
                       <p className="font-black text-gray-900 rtl:text-sm">{i18n.language === 'ar' ? item.product.name.ar : item.product.name.en}</p>
                       <p className="text-xs text-gray-400 font-bold rtl:text-[10px]">{t('menu.qty') || 'Qty'}: {item.quantity}</p>
                     </div>
                   </div>
                   <p className="font-black text-gray-900 rtl:text-sm">{(item.priceAtTime * item.quantity).toLocaleString()} {t('common.currency')}</p>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
               <p className="text-xl font-black text-gray-900 rtl:text-lg">{t('admin.table.total')}</p>
               <p className="text-3xl font-black text-orange-500 rtl:text-2xl">{order.totalAmount.toLocaleString()} {t('common.currency')}</p>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Customer Info */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">{t('admin.customer_details') || 'Customer Details'}</h3>
            <div className="space-y-4 text-start">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1 rtl:text-[10px]">{t('admin.table.name')}</p>
                <p className="font-black text-lg rtl:text-base">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1 rtl:text-[10px]">{t('admin.table.email')}</p>
                <p className="font-bold text-sm text-slate-300 rtl:text-xs">{order.user?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Shipping Info */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 rtl:text-[9px]">{t('admin.order_timeline') || 'Order Timeline'}</h3>
             <div className="space-y-4 text-start">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-gray-900 rtl:text-xs">{t('orders.step_received')}</p>
                    <p className="text-xs text-gray-400 font-bold rtl:text-[10px]">{new Date(order.createdAt).toLocaleString(i18n.language)}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
