import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { successResponse } from '../../utils/responseHandler.js';
import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';

export const getStats = catchAsync(async (req: Request, res: Response) => {
  // 1. Basic KPI Counts
  const [totalOrdersCount, totalUsersCount, deliveredOrders, activeCouponsCount, activeProductsCount] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { totalAmount: true, createdAt: true, address: { include: { zone: true } } }
    }),
    prisma.coupon.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isAvailable: true } })
  ]);

  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  // 2. Sales History (Last 7 Days)
  const salesHistoryMap: Record<string, number> = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    salesHistoryMap[dateStr] = 0;
  }

  deliveredOrders.forEach(order => {
    const dateStr = order.createdAt.toISOString().split('T')[0];
    if (salesHistoryMap[dateStr] !== undefined) {
      salesHistoryMap[dateStr] += Number(order.totalAmount);
    }
  });

  const salesHistory = Object.entries(salesHistoryMap).map(([date, total]) => ({
    date,
    total
  }));

  // 3. Top Zones (Orders per Zone)
  const zoneStatsMap: Record<string, number> = {};
  deliveredOrders.forEach(order => {
    const zoneName = order.address?.zone?.name || 'Unknown';
    zoneStatsMap[zoneName] = (zoneStatsMap[zoneName] || 0) + 1;
  });

  const topZones = Object.entries(zoneStatsMap).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  return successResponse({
    res,
    data: {
      stats: {
        totalRevenue,
        ordersCount: totalOrdersCount,
        usersCount: totalUsersCount,
        activeCoupons: activeCouponsCount,
        activeProducts: activeProductsCount
      },
      salesHistory,
      topZones
    }
  });
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const role = req.query.role as any;
  const skip = (page - 1) * limit;

  const where = role ? { role } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        phone: true
      }
    }),
    prisma.user.count({ where })
  ]);

  return successResponse({
    res,
    data: {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Cannot block an administrator', 400);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, isActive: true }
  });

  return successResponse({
    res,
    message: `User ${updatedUser.isActive ? 'unblocked' : 'blocked'} successfully`,
    data: { user: updatedUser }
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Cannot delete an administrator', 400);

  await prisma.user.delete({ where: { id } });

  return successResponse({
    res,
    message: 'User deleted successfully'
  });
});

