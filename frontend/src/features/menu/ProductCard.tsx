import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Timer, Plus } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../cart/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { i18n, t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const getLocalized = (field: any) => (i18n.language === 'ar' ? field.ar : field.en);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${getLocalized(product.name)} ${t('menu.added_to_cart')}`, {
      icon: <ShoppingBag className="w-5 h-5 text-orange-500" />,
      style: {
        borderRadius: '20px',
        background: '#333',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 border border-gray-100 transition-all group relative"
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-[2rem] shadow-inner">
        {product.imageUrl ? (
          <img
            src={product.imageUrl.startsWith('/uploads') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl}
            alt={getLocalized(product.name)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 italic">
            No preview
          </div>
        )}
        
        {/* Glassmorphism Price Tag */}
        <div className="absolute top-4 end-4 bg-white/30 backdrop-blur-md border border-white/40 px-4 py-2 rounded-2xl shadow-xl shadow-black/10 flex flex-col items-end">
          <span className="text-white font-black text-lg drop-shadow-md">
            ${Number(product.salePrice) > 0 ? product.salePrice : product.price}
          </span>
          {product.discountType !== 'NONE' && (
            <span className="text-[10px] text-white/80 font-bold line-through -mt-1 drop-shadow-sm">
              ${product.price}
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.discountType !== 'NONE' && (
          <div className="absolute top-4 start-4 bg-green-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-200 z-10 animate-bounce">
            {product.discountType === 'PERCENTAGE' ? `-${product.discountValue}%` : `SAVE $${product.discountValue}`}
          </div>
        )}


        {/* Status Badges */}
        <div className="absolute bottom-4 start-4 flex gap-2">
          <div className="bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/10">
            <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span className="text-xs font-black text-white">4.9</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/40">
            <Timer className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-black text-gray-700">{t('menu.delivery_time', { time: '15m' })}</span>
          </div>
        </div>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-red-200">
              {t('menu.out_of_stock')}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-3 pb-2">
        <h3 className="text-2xl font-black text-gray-900 mb-2 truncate leading-tight group-hover:text-orange-600 transition-colors rtl:text-xl">
          {getLocalized(product.name)}
        </h3>
        
        {product.description && (
          <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed font-medium rtl:text-xs">
            {getLocalized(product.description)}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('menu.calories')}</span>
            <span className="text-xs font-bold text-gray-900">{t('menu.kcal', { count: 450 })}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.85, rotate: i18n.language === 'ar' ? 5 : -5 }}
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className={`flex items-center justify-center gap-2 h-14 px-6 rounded-2xl transition-all shadow-lg ${
              product.isAvailable
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100 hover:shadow-orange-200 active:shadow-inner'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span className="font-black text-sm uppercase tracking-wider rtl:text-xs">{t('menu.add')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
