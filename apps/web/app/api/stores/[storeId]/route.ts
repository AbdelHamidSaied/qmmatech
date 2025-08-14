import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

export async function GET(_: Request, { params }: { params: { storeId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string

  const membership = await prisma.membership.findFirst({ where: { userId, tenantId: params.storeId }, include: { tenant: true } })
  if (!membership) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ store: membership.tenant, role: membership.role })
}

export async function PUT(req: Request, { params }: { params: { storeId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string

  const membership = await prisma.membership.findFirst({ where: { userId, tenantId: params.storeId } })
  if (!membership) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { name, theme } = await req.json().catch(() => ({ name: '', theme: '{}' }))
  const updated = await prisma.tenant.update({ where: { id: params.storeId }, data: { name, theme } })
  return NextResponse.json({ store: updated })
}