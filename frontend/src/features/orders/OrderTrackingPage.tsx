import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderDetails, usePayOrder } from './useOrders';
import { useSocket } from '../../hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Truck, Package, MapPin, Receipt, Flame, Bike, Navigation } from 'lucide-react';

const STATUS_STEPS = (t: any) => [
  { status: 'PENDING', icon: Clock, label: t('orders.step_received') || 'Order Received' },
  { status: 'PREPARING', icon: Flame, label: t('orders.step_preparing') || 'Kitchen is Cooking' },
  { status: 'ON_THE_WAY', icon: Bike, label: t('orders.step_on_way') || 'Out for Delivery' },
  { status: 'DELIVERED', icon: CheckCircle2, label: t('orders.step_delivered') || 'Enjoy your Food!' },
];

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useOrderDetails(id!);
  const payMutation = usePayOrder();
  const socket = useSocket();

  const steps = STATUS_STEPS(t);

  useEffect(() => {
    if (!socket || !id) return;

    socket.on('ORDER_STATUS_UPDATED', (data) => {
      if (data.orderId === id) {
        queryClient.invalidateQueries({ queryKey: ['orders', id] });
        toast.success(t('orders.status_updated', { status: t(`orders.${data.status}`) }), {
          duration: 5000,
          icon: <Navigation className="w-5 h-5 text-orange-500" />,
        });
      }
    });

    return () => {
      socket.off('ORDER_STATUS_UPDATED');
    };
  }, [socket, id, queryClient, t]);

  if (isLoading || !order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-50 overflow-hidden"
      >
        <div className="bg-slate-900 p-6 md:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Receipt size={22} />
             </div>
             <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight rtl:text-xl">{t('orders.tracking')}</h1>
                <p className="text-slate-400 font-bold text-xs md:text-sm">{t('orders.order_id')} #{order.id.slice(0, 8).toUpperCase()}</p>
             </div>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest">{t('orders.live_connected')}</span>
          </div>
        </div>

        <div className="p-5 md:p-12">
          {/* Visual Stepper */}
          {/* MOBILE: Vertical stack | MD+: Horizontal */}
          <div className="relative mb-10 md:mb-20">
            {/* Horizontal connector line (md+) */}
            <div className="hidden md:block absolute top-6 start-0 w-full h-1 bg-gray-100 rounded-full" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              className="hidden md:block absolute top-6 start-0 h-1 bg-orange-500 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"
            />

            {/* Vertical connector line (mobile only) */}
            <div className="md:hidden absolute top-5 start-5 bottom-5 w-0.5 bg-gray-100 -translate-x-1/2" />
            <motion.div
              className="md:hidden absolute top-5 start-5 w-0.5 bg-orange-500 -translate-x-1/2 transition-all duration-1000 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            <div className="relative flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                  <div key={step.status} className="flex items-center md:flex-col gap-4 md:gap-0">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        backgroundColor: isCompleted ? '#f97316' : '#f8fafc'
                      }}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 shrink-0 ${
                        isCompleted ? 'text-white shadow-xl shadow-orange-200' : 'text-gray-300'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'animate-bounce' : ''} />
                    </motion.div>
                    <div className="md:mt-4 md:text-center">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1 ${isCompleted ? 'text-orange-600' : 'text-gray-400'}`}>
                        {t('orders.step_count', { count: index + 1 })}
                      </p>
                      <p className={`text-xs font-black md:whitespace-nowrap ${isCompleted ? 'text-slate-900' : 'text-gray-300'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8 md:pt-12 border-t border-gray-50">
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 rtl:ms-2">
                  <MapPin size={14} className="text-orange-500" />
                  {t('checkout.delivery_address')}
                </h3>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                   <p className="font-black text-slate-900 text-lg leading-snug rtl:text-base text-start">
                      {order.address?.street}, {order.address?.city}
                   </p>
                   {order.notes && (
                      <p className="mt-3 text-sm font-bold text-gray-500 flex items-center gap-2 italic text-start">
                         <Navigation size={12} className="rtl:rotate-180" /> "{order.notes}"
                      </p>
                   )}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:text-right">
              <div className="flex flex-col md:items-end">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  {t('checkout.summary')}
                </h3>
                <div className="flex flex-col md:items-end">
                   <div className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-2 rtl:flex-row-reverse">
                      {order.totalAmount}
                      <span className="text-orange-500 text-2xl font-bold uppercase">{t('common.currency')}</span>
                   </div>
                   <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'COMPLETED' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                      {t(`orders.payment_${order.paymentStatus.toLowerCase()}`) || order.paymentStatus}
                   </div>
                </div>

                {order.paymentMethod === 'ONLINE_PAYMENT' && order.paymentStatus !== 'COMPLETED' && (
                  <button
                    onClick={() => payMutation.mutate(order.id)}
                    disabled={payMutation.isPending}
                    className="w-full md:w-auto mt-8 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-500 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                  >
                    {payMutation.isPending ? t('common.loading') : t('orders.pay_now')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
