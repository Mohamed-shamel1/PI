import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminOrders, useUpdateOrderStatus, ADMIN_ORDERS_KEY } from './useAdminOrders';
import { format } from 'date-fns';
import { useSocket } from '../../../hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Bell, User, Clock, DollarSign, ChevronRight, CheckCircle2, Package, Truck, XCircle } from 'lucide-react';

const STATUS_OPTIONS = (t: any) => [
  { value: 'PENDING', label: t('admin.status.PENDING'), icon: Clock, color: 'text-yellow-500' },
  { value: 'PREPARING', label: t('admin.status.PREPARING'), icon: Package, color: 'text-blue-500' },
  { value: 'ON_THE_WAY', label: t('admin.status.ON_THE_WAY'), icon: Truck, color: 'text-orange-500' },
  { value: 'DELIVERED', label: t('admin.status.DELIVERED'), icon: CheckCircle2, color: 'text-green-500' },
  { value: 'CANCELLED', label: t('admin.status.CANCELLED'), icon: XCircle, color: 'text-red-500' },
];

export const AdminOrdersPage = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const socket = useSocket();
  const [hasNewOrders, setHasNewOrders] = useState(false);

  const statusOptions = STATUS_OPTIONS(t);

  useEffect(() => {
    if (!socket) return;

    socket.on('NEW_ORDER', (data) => {
      setHasNewOrders(true);
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY });
      }, 500);

      toast.success(t('admin.notifications.new_order', { name: data.customerName }), {
        icon: '🔔',
        duration: 5000,
      });
    });

    return () => {
      socket.off('NEW_ORDER');
    };
  }, [socket, queryClient, t]);

  if (isLoading) return (
    <div className="p-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">{t('admin.sidebar.orders')}</h1>
            <p className="text-gray-400 font-bold text-sm rtl:text-xs">{t('admin.orders_desc') || 'Monitor and process customer orders in real-time'}</p>
          </div>
        </div>

        <AnimatePresence>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                socket ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${socket ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {socket ? t('admin.socket_connected') : t('admin.socket_disconnected')}
            </motion.div>
            
            {hasNewOrders && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setHasNewOrders(false)}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-orange-200"
              >
                <Bell className="w-5 h-5 animate-bounce" />
                {t('admin.new_orders_badge') || 'NEW ORDERS'}
              </motion.button>
            )}
          </div>
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto admin-scroll no-scrollbar">
        <table className="w-full text-start responsive-table">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="px-4 md:px-8 py-4 md:py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start whitespace-nowrap">{t('admin.table.items')}</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start whitespace-nowrap">{t('admin.table.customer')}</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start whitespace-nowrap">{t('admin.table.price')}</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start whitespace-nowrap">{t('admin.table.status')}</th>
              <th className="px-4 md:px-8 py-4 md:py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-start whitespace-nowrap">{t('admin.table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence mode="popLayout">
              {orders?.map((order) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={order.id} 
                  className="group hover:bg-orange-50/30 transition-all border-s-4 border-transparent hover:border-orange-500"
                >
                  <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900 group-hover:text-orange-600 transition-colors">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={10} /> {format(new Date(order.createdAt), i18n.language === 'ar' ? 'dd MMM, p' : 'MMM d, p')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-500 transition-all">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 rtl:text-xs">{order.user?.name}</span>
                        <span className="text-xs font-bold text-gray-400 rtl:text-[10px]">{order.user?.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-0.5 text-lg font-black text-slate-900 rtl:flex-row-reverse rtl:justify-end">
                        <span className="text-orange-500 text-sm font-bold uppercase ms-1">{t('common.currency')}</span>
                        {order.totalAmount}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('admin.table.total')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative inline-block w-full max-w-[180px]">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                        disabled={updateStatusMutation.isPending}
                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-xs font-black transition-all appearance-none cursor-pointer disabled:opacity-50 text-start"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <button className="p-3 bg-gray-50 text-gray-400 hover:bg-orange-500 hover:text-white rounded-xl transition-all rtl:rotate-180">
                        <ChevronRight size={20} />
                     </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>

        </table>
        </div>
        {orders?.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                <ClipboardList size={40} />
             </div>
             <p className="text-gray-400 font-bold">{t('admin.no_orders_found') || 'No orders found'}</p>
          </div>
        )}
      </div>
    </div>

  );
};
