import { prisma } from './client';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('password', 10);

  const acme = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Store',
      slug: 'acme',
      theme: JSON.stringify({
        primaryColor: '#2563eb',
        logoUrl: '',
      }),
    },
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {},
    create: {
      name: 'Globex Shop',
      slug: 'globex',
      theme: JSON.stringify({
        primaryColor: '#16a34a',
        logoUrl: '',
      }),
    },
  });

  const adminAcme = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: { passwordHash: password },
    create: {
      email: 'admin@acme.com',
      passwordHash: password,
      role: 'ADMIN',
    },
  });

  const adminGlobex = await prisma.user.upsert({
    where: { email: 'admin@globex.com' },
    update: { passwordHash: password },
    create: {
      email: 'admin@globex.com',
      passwordHash: password,
      role: 'ADMIN',
    },
  });

  // memberships
  await prisma.membership.upsert({
    where: { userId_tenantId: { userId: adminAcme.id, tenantId: acme.id } },
    update: { role: 'OWNER' },
    create: { userId: adminAcme.id, tenantId: acme.id, role: 'OWNER' },
  });

  await prisma.membership.upsert({
    where: { userId_tenantId: { userId: adminGlobex.id, tenantId: globex.id } },
    update: { role: 'OWNER' },
    create: { userId: adminGlobex.id, tenantId: globex.id, role: 'OWNER' },
  });

  const sampleProducts = [
    {
      title: 'T-Shirt',
      description: 'Comfortable cotton t-shirt',
      priceCents: 1999,
      imageUrl: 'https://picsum.photos/seed/tshirt/600/600',
    },
    {
      title: 'Sneakers',
      description: 'Stylish sneakers for everyday use',
      priceCents: 6999,
      imageUrl: 'https://picsum.photos/seed/sneakers/600/600',
    },
    {
      title: 'Backpack',
      description: 'Durable backpack with multiple compartments',
      priceCents: 4999,
      imageUrl: 'https://picsum.photos/seed/backpack/600/600',
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.create({
      data: { ...product, currency: 'USD', tenantId: acme.id },
    });
    await prisma.product.create({
      data: { ...product, tenantId: globex.id, title: `${product.title} Pro` },
    });
  }

  console.log('Seed complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});