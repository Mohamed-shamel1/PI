import { PrismaClient, DiscountType, OrderStatus, PaymentMethod, PaymentStatus, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean up existing data
  console.log('🧹 Cleaning up old data...');
  await prisma.orderStatusLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Delivery Zones
  console.log('📍 Creating Delivery Zones...');
  const zonesData = [
    { name: 'Maadi', deliveryFee: 20 },
    { name: 'Dokki', deliveryFee: 15 },
    { name: 'Zamalek', deliveryFee: 25 },
    { name: 'Nasr City', deliveryFee: 30 },
    { name: 'Sheikh Zayed', deliveryFee: 50 },
  ];
  
  const zones = [];
  for (const zone of zonesData) {
    zones.push(await prisma.deliveryZone.create({ data: zone }));
  }

  // 3. Create Categories
  console.log('🍔 Creating Categories...');
  const categoriesData = [
    { name: { en: 'Burgers', ar: 'برجر' } },
    { name: { en: 'Pizza', ar: 'بيتزا' } },
    { name: { en: 'Pasta', ar: 'مكرونة' } },
    { name: { en: 'Drinks', ar: 'مشروبات' } },
    { name: { en: 'Desserts', ar: 'حلويات' } },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    categories.push(await prisma.category.create({ data: cat }));
  }

  // 4. Create Products
  console.log('🍟 Creating Products...');
  const productsData = [
    { catIdx: 0, name: { en: 'Classic Beef Burger', ar: 'برجر لحم كلاسيك' }, desc: { en: 'Juicy beef patty with cheese and veggies.', ar: 'شريحة لحم مع الجبن والخضار' }, price: 150, image: '/uploads/products/p1.jpg' },
    { catIdx: 0, name: { en: 'Chicken Crispy', ar: 'دجاج مقرمش' }, desc: { en: 'Crispy fried chicken breast.', ar: 'صدر دجاج مقلي ومقرمش' }, price: 130, image: '/uploads/products/p2.jpg' },
    { catIdx: 0, name: { en: 'Double Smash', ar: 'دبل سماش' }, desc: { en: 'Two smashed patties with special sauce.', ar: 'شريحتين سماش مع صوص خاص' }, price: 200, discountType: DiscountType.PERCENTAGE, discountValue: 10, salePrice: 180, image: '/uploads/products/p3.jpg' },
    { catIdx: 1, name: { en: 'Margherita Pizza', ar: 'بيتزا مارجريتا' }, desc: { en: 'Classic cheese and tomato sauce.', ar: 'جبنة وصوص طماطم كلاسيك' }, price: 120, image: '/uploads/products/p4.jpg' },
    { catIdx: 1, name: { en: 'Pepperoni Pizza', ar: 'بيتزا ببروني' }, desc: { en: 'Loaded with pepperoni and cheese.', ar: 'مليئة بالببروني والجبن' }, price: 160, image: '/uploads/products/p5.jpg' },
    { catIdx: 1, name: { en: 'BBQ Chicken Pizza', ar: 'بيتزا دجاج باربيكيو' }, desc: { en: 'Chicken with BBQ sauce and onions.', ar: 'دجاج مع صوص الباربيكيو والبصل' }, price: 170, discountType: DiscountType.FIXED, discountValue: 20, salePrice: 150, image: '/uploads/products/p6.jpg' },
    { catIdx: 2, name: { en: 'Alfredo Pasta', ar: 'مكرونة ألفريدو' }, desc: { en: 'Creamy white sauce with mushroom.', ar: 'صوص أبيض كريمي مع المشروم' }, price: 140, image: '/uploads/products/p7.jpg' },
    { catIdx: 2, name: { en: 'Penne Arrabiata', ar: 'مكرونة أرابياتا' }, desc: { en: 'Spicy tomato sauce.', ar: 'صوص طماطم حار' }, price: 110, image: '/uploads/products/p8.jpg' },
    { catIdx: 3, name: { en: 'Cola', ar: 'كولا' }, desc: { en: 'Cold refreshing drink.', ar: 'مشروب بارد منعش' }, price: 20, image: '/uploads/products/p9.jpg' },
    { catIdx: 3, name: { en: 'Orange Juice', ar: 'عصير برتقال' }, desc: { en: 'Freshly squeezed orange juice.', ar: 'عصير برتقال طازج' }, price: 35, image: '/uploads/products/p10.jpg' },
    { catIdx: 3, name: { en: 'Water', ar: 'مياه معدنية' }, desc: { en: 'Small bottle of water.', ar: 'زجاجة مياه صغيرة' }, price: 10, image: '/uploads/products/p11.jpg' },
    { catIdx: 4, name: { en: 'Chocolate Cake', ar: 'كيكة شوكولاتة' }, desc: { en: 'Rich and moist chocolate cake.', ar: 'كيكة شوكولاتة غنية' }, price: 60, image: '/uploads/products/p12.jpg' },
    { catIdx: 4, name: { en: 'Cheesecake', ar: 'تشيز كيك' }, desc: { en: 'Classic NY style cheesecake.', ar: 'تشيز كيك نيويورك كلاسيك' }, price: 75, image: '/uploads/products/p13.jpg' },
    { catIdx: 4, name: { en: 'Ice Cream Sundae', ar: 'آيس كريم صنداي' }, desc: { en: 'Vanilla ice cream with chocolate syrup.', ar: 'آيس كريم فانيليا مع صوص الشوكولاتة' }, price: 45, image: '/uploads/products/p14.jpg' },
    { catIdx: 4, name: { en: 'Brownie', ar: 'براوني' }, desc: { en: 'Fudgy chocolate brownie.', ar: 'براوني شوكولاتة' }, price: 50, discountType: DiscountType.PERCENTAGE, discountValue: 20, salePrice: 40, image: '/uploads/products/p15.jpg' },
  ];

  const products = [];
  for (const p of productsData) {
    products.push(await prisma.product.create({
      data: {
        categoryId: categories[p.catIdx].id,
        name: p.name,
        description: p.desc,
        price: p.price,
        discountType: p.discountType || DiscountType.NONE,
        discountValue: p.discountValue || 0,
        salePrice: p.salePrice || p.price,
        imageUrl: p.image,
        isAvailable: true,
      }
    }));
  }

  // 5. Create Coupons
  console.log('🎟️ Creating Coupons...');
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME20', discountType: DiscountType.PERCENTAGE, discountValue: 20, expiryDate: nextMonth, usageLimit: 100 },
      { code: 'BIGOFF', discountType: DiscountType.FIXED, discountValue: 50, expiryDate: nextMonth, usageLimit: 50 },
      { code: 'SUMMER50', discountType: DiscountType.PERCENTAGE, discountValue: 50, expiryDate: nextMonth, usageLimit: 10 },
    ]
  });

  // 6. Create Users & Addresses
  console.log('👥 Creating Users and Addresses...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@foodpi.com',
      password: hashedPassword,
      phone: '01000000000',
      role: Role.ADMIN,
    }
  });

  // Customers
  const customers = [];
  for (let i = 1; i <= 10; i++) {
    const zone = zones[i % zones.length];
    const customer = await prisma.user.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        password: hashedPassword,
        phone: `0110000000${i}`,
        role: Role.CUSTOMER,
        addresses: {
          create: {
            street: `Street ${i}`,
            city: 'Cairo',
            buildingNumber: `${10 + i}`,
            isDefault: true,
            zoneId: zone.id
          }
        }
      },
      include: { addresses: true }
    });
    customers.push(customer);
  }

  // 7. Generate Orders
  console.log('📦 Generating Orders...');
  
  const statuses = [
    { status: OrderStatus.DELIVERED, weight: 70 },
    { status: OrderStatus.PENDING, weight: 10 },
    { status: OrderStatus.PREPARING, weight: 10 },
    { status: OrderStatus.CANCELLED, weight: 10 },
  ];

  function getRandomStatus() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const s of statuses) {
      sum += s.weight;
      if (rand <= sum) return s.status;
    }
    return OrderStatus.DELIVERED;
  }

  for (let i = 0; i < 40; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const address = customer.addresses[0];
    const zone = zones.find(z => z.id === address.zoneId);
    const deliveryFee = zone ? zone.deliveryFee : 0;
    
    // Pick 1-3 random products
    const orderItemsCount = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    for(let j = 0; j < orderItemsCount; j++) {
      selectedProducts.push(products[Math.floor(Math.random() * products.length)]);
    }

    let subtotal = 0;
    const itemsData = selectedProducts.map(p => {
      const price = p.discountType !== DiscountType.NONE ? Number(p.salePrice) : Number(p.price);
      const quantity = Math.floor(Math.random() * 2) + 1;
      subtotal += price * quantity;
      return {
        productId: p.id,
        quantity,
        priceAtTime: price
      };
    });

    const hasCoupon = Math.random() > 0.7; // 30% chance of coupon
    let discountAmount = 0;
    let couponCode = null;
    
    if (hasCoupon) {
      couponCode = 'WELCOME20';
      discountAmount = subtotal * 0.2;
    }

    const totalAmount = subtotal + deliveryFee - discountAmount;
    const status = getRandomStatus();
    
    // Random date in last 10 days
    const daysAgo = Math.floor(Math.random() * 10);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);

    await prisma.order.create({
      data: {
        userId: customer.id,
        addressId: address.id,
        status: status,
        totalAmount,
        deliveryFee,
        couponCode,
        discountAmount,
        paymentMethod: Math.random() > 0.5 ? PaymentMethod.CASH_ON_DELIVERY : PaymentMethod.ONLINE_PAYMENT,
        paymentStatus: status === OrderStatus.DELIVERED ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
        createdAt: orderDate,
        items: {
          create: itemsData
        }
      }
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
