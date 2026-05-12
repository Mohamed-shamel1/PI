import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Ticket,
  TrendingUp, 
  Calendar,
  LayoutDashboard,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f59e0b'];

export const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-gray-200 rounded-[2rem]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-[2.5rem]" />
          <div className="h-96 bg-gray-200 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  const { stats, salesHistory, topZones } = analyticsData;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1 rtl:flex-row-reverse">
             <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <LayoutDashboard size={20} />
             </div>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">
               {t('admin.sidebar.dashboard')}
             </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-400 mt-1 rtl:flex-row-reverse rtl:justify-end">
            <Calendar size={14} />
            <span className="text-sm font-bold rtl:text-xs">{new Date().toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          icon={<DollarSign size={20} className="text-blue-600" />} 
          bg="bg-blue-50"
          label={t('admin.dashboard.total_revenue')} 
          value={`${stats.totalRevenue.toLocaleString()}`} 
          unit={t('common.currency')}
          desc={t('admin.dashboard.revenue_desc')}
          index={0}
        />
        <StatCard 
          icon={<ShoppingBag size={20} className="text-green-600" />} 
          bg="bg-green-50"
          label={t('admin.dashboard.total_orders')} 
          value={stats.ordersCount} 
          desc={t('admin.dashboard.orders_desc')}
          index={1}
        />
        <StatCard 
          icon={<Users size={20} className="text-purple-600" />} 
          bg="bg-purple-50"
          label={t('admin.dashboard.total_customers')} 
          value={stats.usersCount} 
          desc={t('admin.dashboard.customers_desc')}
          index={2}
        />
        <StatCard 
          icon={<Package size={20} className="text-orange-600" />} 
          bg="bg-orange-50"
          label={t('admin.dashboard.active_products')} 
          value={stats.activeProducts} 
          index={3}
        />
        <StatCard 
          icon={<Ticket size={20} className="text-pink-600" />} 
          bg="bg-pink-50"
          label={t('admin.dashboard.active_coupons')} 
          value={stats.activeCoupons} 
          index={4}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales History Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight rtl:text-xl">{t('admin.dashboard.sales_history')}</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 rtl:text-[10px]">{t('admin.dashboard.revenue_overview')}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
               <TrendingUp size={24} />
            </div>
          </div>
          
          <div className="h-[350px] w-full" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} 
                  dy={15}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric' })}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }}
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  itemStyle={{ color: '#f97316', fontWeight: 900 }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px', color: '#1e293b' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ${t('common.currency')}`, t('admin.dashboard.total_revenue')]}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#f97316" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders by Zone Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight rtl:text-lg">{t('admin.dashboard.orders_by_zone')}</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mt-3">
               <PieIcon size={20} />
            </div>
          </div>

          <div className="flex-1 min-h-[300px]" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topZones}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {topZones.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontWeight: 800 }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, bg, label, value, unit, desc, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-6 rounded-[2.2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-2xl hover:shadow-orange-500/5 transition-all h-full"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
        {icon}
      </div>
      {desc && (
        <div className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center text-[10px] text-gray-300 font-bold cursor-help" title={desc}>?</div>
      )}
    </div>
    <div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 rtl:text-[9px]">{label}</p>
      <div className="flex items-baseline gap-1 rtl:flex-row-reverse">
        <h4 className="text-2xl font-black text-gray-900 tracking-tighter rtl:text-xl">{value}</h4>
        {unit && <span className="text-[10px] font-black text-gray-400 uppercase">{unit}</span>}
      </div>
    </div>
  </motion.div>
);

