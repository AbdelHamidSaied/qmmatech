import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'

export async function POST(req: Request) {
  const host = headers().get('host') || ''
  const slug = host.split(':')[0].split('.')[0] || 'acme'
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const form = await req.formData()
  const title = String(form.get('title') || '')
  const description = String(form.get('description') || '')
  const price = Number(form.get('price') || 0)
  const imageUrl = String(form.get('imageUrl') || '')

  if (!title || !description || !price) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      title,
      description,
      priceCents: Math.round(price * 100),
      imageUrl: imageUrl || null,
      currency: 'USD',
    },
  })

  return NextResponse.json({ product })
}