import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';

export const getAllCoupons = async () => {
  return await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const createCoupon = async (data: any) => {
  return await prisma.coupon.create({ data });
};

export const updateCoupon = async (id: string, data: any) => {
  return await prisma.coupon.update({
    where: { id },
    data
  });
};

export const deleteCoupon = async (id: string) => {
  return await prisma.coupon.delete({
    where: { id }
  });
};

export const getCouponByCode = async (code: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code, isActive: true }
  });

  if (!coupon) throw new AppError('Invalid or inactive coupon code', 404);
  if (new Date() > new Date(coupon.expiryDate)) throw new AppError('Coupon has expired', 400);
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', 400);

  return coupon;
};
