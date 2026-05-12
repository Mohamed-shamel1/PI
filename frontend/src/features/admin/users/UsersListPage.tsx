import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Trash2,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UsersListPage = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data;
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/admin/users/${userId}/status`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(data.user.isActive ? t('admin.notifications.unblocked') : t('admin.notifications.blocked'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('admin.notifications.error_update'));
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t('admin.notifications.success_delete'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('admin.notifications.error_delete'));
    }
  });

  const filteredUsers = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.filter((user: any) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersData, searchQuery, roleFilter]);

  if (isLoading) {
    return <div className="space-y-6 animate-pulse">
      <div className="h-12 w-48 bg-gray-200 rounded-xl" />
      <div className="h-[600px] bg-white rounded-[2.5rem] border border-gray-100" />
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight rtl:text-2xl">
            {t('admin.sidebar.users')}
          </h1>
          <p className="text-gray-500 font-bold mt-1 rtl:text-xs">
            {t('admin.found_items', { count: filteredUsers.length }) || `Found ${filteredUsers.length} users`}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors rtl:scale-x-[-1]" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.placeholders.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-100 focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl ps-12 pe-4 py-2.5 text-sm font-bold shadow-sm transition-all w-full sm:w-72"
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border-gray-100 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 text-start w-full sm:w-auto"
          >
            <option value="ALL">{t('admin.table.all_roles') || 'All Roles'}</option>
            <option value="ADMIN">{t('admin.status.ADMIN')}</option>
            <option value="CUSTOMER">{t('admin.status.USER')}</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto admin-scroll no-scrollbar">
          <table className="w-full border-collapse text-start responsive-table">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400">
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.customer')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.role')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.date')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.status')}</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-start whitespace-nowrap">{t('admin.table.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode='popLayout'>
                {filteredUsers.map((user: any) => (
                  <motion.tr 
                    layout
                    key={user.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-base md:text-lg shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 rtl:text-sm">{user.name}</h4>
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold mt-0.5 rtl:text-[10px]">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {user.role === 'ADMIN' ? t('admin.status.ADMIN') : t('admin.status.USER')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold rtl:text-xs">
                        <Calendar size={14} className="text-gray-300" />
                        {new Date(user.createdAt).toLocaleDateString(i18n.language)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {user.isActive ? t('admin.status.ACTIVE') : t('admin.status.BLOCKED')}
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleStatusMutation.mutate(user.id)}
                          disabled={user.role === 'ADMIN' || toggleStatusMutation.isPending}
                          className={`p-2.5 rounded-xl transition-all ${
                            user.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'
                          } disabled:opacity-30`}
                        >
                          {toggleStatusMutation.isPending && toggleStatusMutation.variables === user.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            user.isActive ? <UserX size={18} /> : <UserCheck size={18} />
                          )}
                        </button>
                        
                        <button 
                          onClick={() => {
                            if (window.confirm(t('admin.notifications.confirm_delete_user'))) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                          disabled={user.role === 'ADMIN' || deleteUserMutation.isPending}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30"
                        >
                           {deleteUserMutation.isPending && deleteUserMutation.variables === user.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
