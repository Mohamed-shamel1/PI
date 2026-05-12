import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  return cart;
};

export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  // 1) Ensure product exists and is available
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isAvailable) {
    throw new AppError('Product not available', 400);
  }

  // 2) Get or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 3) Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

export const removeItemFromCart = async (userId: string, productId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found', 404);

  return await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId,
    },
  });
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  return await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};
