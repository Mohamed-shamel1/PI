import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './authStore';
import { useUpdateProfile } from './useUpdateProfile';
import { Camera, User, Lock, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  
  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ? `http://localhost:5000${user.avatar}` : null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (avatarFile) formData.append('avatar', avatarFile);
    
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[calc(100vh-80px)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 p-6 md:p-10 border border-gray-50"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t('common.update_profile')}</h1>
            <p className="text-gray-400 font-bold text-sm">Manage your personal information and security</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-gray-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-start flex-1 flex flex-col justify-center">
              <h3 className="font-black text-gray-900 text-lg mb-1">{t('common.upload_image')}</h3>
              <p className="text-xs text-gray-400 font-bold max-w-[200px] mb-3">
                JPG, GIF or PNG. Max size of 2MB
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors self-center sm:self-start"
              >
                {t('common.choose_file')}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block ms-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block ms-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-gray-100 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-orange-500 transition-all shadow-xl shadow-gray-200 hover:shadow-orange-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {updateProfileMutation.isPending ? 'Saving...' : t('common.save')}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};
