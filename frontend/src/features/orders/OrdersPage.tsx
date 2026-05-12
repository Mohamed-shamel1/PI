import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOrders } from './useOrders';
import { format } from 'date-fns';
import { ChevronRight, Package, Clock } from 'lucide-react';

export const OrdersPage = () => {
  const { t, i18n } = useTranslation();
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading your orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>

      <div className="space-y-4">
        {orders?.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white p-6 rounded-xl shadow-sm border hover:border-primary transition-all group"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {format(new Date(order.createdAt), 'PPP p')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-extrabold text-xl">{order.totalAmount} USD</div>
                  <div className="text-sm font-medium uppercase text-primary">
                    {t(`orders.${order.status}`)}
                  </div>
                </div>
                <ChevronRight className={`w-6 h-6 text-gray-300 group-hover:text-primary transition-colors ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </Link>
        ))}

        {(!orders || orders.length === 0) && (
          <div className="text-center py-20 text-gray-500">
            You haven't placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
};
