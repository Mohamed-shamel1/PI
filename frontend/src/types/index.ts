export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Category {
  id: string;
  name: { en: string; ar: string };
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
  statusLogs: OrderStatusLog[];
  createdAt: string;
  user?: User;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
}

export interface OrderStatusLog {
  id: string;
  status: string;
  note?: string;
  createdAt: string;
}
