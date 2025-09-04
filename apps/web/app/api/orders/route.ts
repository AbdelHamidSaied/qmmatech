import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'
import { getStoreSlugFromHost } from '../../lib/tenant'

export async function POST(req: Request) {
  const host = headers().get('host')
  const slug = getStoreSlugFromHost(host)
  const { email, totalCents } = await req.json().catch(() => ({ email: '', totalCents: 0 }))

  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const order = await prisma.order.create({
    data: {
      tenantId: tenant.id,
      email: email || 'buyer@example.com',
      totalCents: totalCents || 1234,
      currency: 'USD',
    },
  })

  return NextResponse.json({ order })
}