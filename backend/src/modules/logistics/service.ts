import prisma from '../../prisma/client.js';

export const getAllZones = async () => {
  return await prisma.deliveryZone.findMany({
    orderBy: { name: 'asc' }
  });
};

export const createZone = async (data: any) => {
  return await prisma.deliveryZone.create({ data });
};

export const updateZone = async (id: string, data: any) => {
  return await prisma.deliveryZone.update({
    where: { id },
    data
  });
};

export const deleteZone = async (id: string) => {
  return await prisma.deliveryZone.delete({
    where: { id }
  });
};
