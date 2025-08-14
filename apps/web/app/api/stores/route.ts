import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string

  const stores = await prisma.membership.findMany({
    where: { userId },
    include: { tenant: true },
    orderBy: { tenant: { createdAt: 'desc' } },
  })

  return NextResponse.json({ stores })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string

  const { name, slug } = await req.json().catch(() => ({ name: '', slug: '' }))
  if (!name || !slug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const exists = await prisma.tenant.findUnique({ where: { slug } })
  if (exists) return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })

  const tenant = await prisma.tenant.create({ data: { name, slug, theme: '{}' } })
  await prisma.membership.create({ data: { userId, tenantId: tenant.id, role: 'OWNER' } })

  return NextResponse.json({ tenant })
}