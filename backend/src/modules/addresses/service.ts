import prisma from '../../prisma/client.js';

export const getMyAddresses = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    include: { zone: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const createAddress = async (userId: string, data: any) => {
  // If isDefault is true, unset other defaults
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  return await prisma.address.create({
    data: {
      ...data,
      userId
    },
    include: { zone: true }
  });
};

export const deleteAddress = async (id: string, userId: string) => {
  return await prisma.address.delete({
    where: { id, userId }
  });
};
