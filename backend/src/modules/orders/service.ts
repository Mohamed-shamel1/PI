import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';
import { getIO } from '../../utils/socket.js';

export const checkout = async (userId: string, data: any) => {
  const { addressId: providedAddressId, address: addressData, paymentMethod, notes, couponCode, items: payloadItems } = data;
  const MOCK_ID = '00000000-0000-0000-0000-000000000000';

  const result = await prisma.$transaction(async (tx) => {
    let orderItemsToProcess: any[] = [];
    let finalAddressId = providedAddressId;

    // 0) Handle Address Creation
    let orderDeliveryFee = 0;

    if (!finalAddressId || finalAddressId === MOCK_ID) {
      if (!addressData) {
        throw new AppError('Delivery address is required', 400);
      }
      
      const zone = await tx.deliveryZone.findUnique({ where: { id: addressData.zoneId } });
      if (!zone) throw new AppError('Invalid delivery zone', 400);
      orderDeliveryFee = zone.deliveryFee;

      const newAddress = await tx.address.create({
        data: {
          userId,
          street: addressData.street,
          city: addressData.city,
          zoneId: addressData.zoneId,
          isDefault: true
        }
      });
      finalAddressId = newAddress.id;
    } else {
      // Verify address exists and belongs to user
      const existingAddress = await tx.address.findUnique({
        where: { id: finalAddressId },
        include: { zone: true }
      });
      if (!existingAddress || existingAddress.userId !== userId) {
        throw new AppError('Invalid delivery address', 400);
      }
      orderDeliveryFee = existingAddress.zone?.deliveryFee || 0;
    }


    // 1) Get items from payload or DB cart
    if (payloadItems && payloadItems.length > 0) {
      // Use items from request body (Zustand/Local State)
      const productIds = payloadItems.map((i: any) => i.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } }
      });

      orderItemsToProcess = payloadItems.map((item: any) => {
        const product = dbProducts.find(p => p.id === item.productId);
        if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
        return {
          productId: item.productId,
          quantity: item.quantity,
          product
        };
      });
    } else {
      // Fallback: Fetch user's cart from DB
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError('Your cart is empty', 400);
      }
      orderItemsToProcess = cart.items;
    }

    // 2) Calculate subtotal
    let subtotal = 0;
    orderItemsToProcess.forEach((item) => {
      const price = item.product.salePrice && Number(item.product.salePrice) > 0 
        ? Number(item.product.salePrice) 
        : Number(item.product.price);
      subtotal += item.quantity * price;
    });

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await tx.coupon.findUnique({
        where: { code: couponCode, isActive: true },
      });

      if (coupon) {
        if (new Date() > new Date(coupon.expiryDate)) {
          throw new AppError('Coupon has expired', 400);
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          throw new AppError('Coupon usage limit reached', 400);
        }

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = subtotal * (Number(coupon.discountValue) / 100);
        } else {
          discountAmount = Math.min(subtotal, Number(coupon.discountValue));
        }

        // Increment usage
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    const totalAmount = subtotal - discountAmount + orderDeliveryFee;


    // 3) Create the Order
    const order = await tx.order.create({
      data: {
        userId,
        addressId: finalAddressId,
        totalAmount,
        deliveryFee: orderDeliveryFee,
        couponCode: couponCode || null,
        discountAmount,
        paymentMethod,
        notes,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'ONLINE_PAYMENT' ? 'PENDING' : 'PENDING',
      },
    });

    // 4) Map cart items to OrderItems
    const orderItemsData = orderItemsToProcess.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtTime: item.product.salePrice && Number(item.product.salePrice) > 0 
        ? item.product.salePrice 
        : item.product.price,
    }));

    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    // 5) Create initial status log
    await tx.orderStatusLog.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        note: 'Order placed successfully',
      },
    });

    // 6) Clear the cart (if it exists in DB)
    await tx.cartItem.deleteMany({
      where: { cart: { userId } },
    });

    return order;
  });

  // Emit Real-time Event to Admins
  try {
    const io = getIO();
    io.emit('NEW_ORDER', { 
      orderId: result.id, 
      customerName: result.user?.name || 'Customer',
      totalAmount: result.totalAmount 
    });
  } catch (err) {
    console.error('Socket emission failed:', err);
  }

  return result;
};

export const getMyOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      statusLogs: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderById = async (id: string, userId: string, isAdmin = false) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      statusLogs: true,
      address: true,
      user: isAdmin ? true : false,
    },
  });

  if (!order) throw new AppError('Order not found', 404);
  
  // Security check: only owner or admin can see the order
  if (!isAdmin && order.userId !== userId) {
    throw new AppError('You do not have permission to view this order', 403);
  }

  return order;
};

export const getAllOrdersAdmin = async () => {
  return await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateOrderStatus = async (id: string, status: any) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError('Order not found', 404);

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: { status },
    });

    await tx.orderStatusLog.create({
      data: {
        orderId: id,
        status,
        note: `Status updated to ${status}`,
      },
    });

    return updated;
  });

  // Emit Real-time Event to Customer
  try {
    const io = getIO();
    io.to(`user_${order.userId}`).emit('ORDER_STATUS_UPDATED', {
      orderId: id,
      status: status
    });
  } catch (err) {
    console.error('Socket emission failed:', err);
  }

  return updatedOrder;
};

export const processOnlinePaymentService = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw new AppError('Order not found', 404);
  if (order.userId !== userId) throw new AppError('Unauthorized access to this order', 403);
  if (order.paymentMethod !== 'ONLINE_PAYMENT') {
    throw new AppError('This order is not eligible for online payment', 400);
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: 'COMPLETED' },
  });
};
