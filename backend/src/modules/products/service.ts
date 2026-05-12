import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';

const calculateSalePrice = (price: number, discountType: string, discountValue: number) => {
  if (discountType === 'PERCENTAGE') {
    return price - (price * (discountValue / 100));
  }
  if (discountType === 'FIXED') {
    return Math.max(0, price - discountValue);
  }
  return price;
};


export const createProduct = async (data: any) => {
  const salePrice = calculateSalePrice(data.price, data.discountType, data.discountValue || 0);
  return await prisma.product.create({ 
    data: { ...data, salePrice } 
  });
};

export const addProductOption = async (productId: string, data: any) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);

  return await prisma.productOption.create({
    data: {
      ...data,
      productId,
    },
  });
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    where: { isAvailable: true },
    include: {
      category: true,
      options: true,
    },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      options: true,
    },
  });

  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const updateProduct = async (id: string, data: any) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);

  const price = data.price ?? Number(product.price);
  const discountType = data.discountType ?? product.discountType;
  const discountValue = data.discountValue ?? Number(product.discountValue);
  
  const salePrice = calculateSalePrice(price, discountType, discountValue);

  return await prisma.product.update({
    where: { id },
    data: { ...data, salePrice },
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);

  // Soft delete by setting isAvailable: false
  return await prisma.product.update({
    where: { id },
    data: { isAvailable: false },
  });
};

export const getAllProductsAdmin = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
      options: true
    },
    orderBy: { createdAt: 'desc' }
  });
};
