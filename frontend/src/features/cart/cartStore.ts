import { create } from 'zustand';
import { CartItem, Product } from '../../types/index';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    const { items } = get();
    const existing = items.find((item) => item.productId === product.id);

    if (existing) {
      set({
        items: items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            id: Math.random().toString(36).substr(2, 9),
            productId: product.id,
            product,
            quantity: 1,
          },
        ],
      });
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.productId !== productId) });
  },
  updateQty: (productId, quantity) => {
    if (quantity < 1) return;
    set({
      items: get().items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce(
      (acc, item) => {
        const price = item.product.salePrice  && Number(item.product.salePrice) > 0 
          ? Number(item.product.salePrice) 
          : Number(item.product.price);
        return acc + item.quantity * price;
      },
      0
    );
  },
}));
