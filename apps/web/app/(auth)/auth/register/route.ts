import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({ email: '', password: '' }))
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const hash = await bcrypt.hash(password, 10)
  const defaultStore = await prisma.tenant.findUnique({ where: { slug: 'acme' } })

  const user = await prisma.user.create({ data: { email, passwordHash: hash, role: 'MERCHANT' } })
  if (defaultStore) {
    await prisma.membership.create({ data: { userId: user.id, tenantId: defaultStore.id, role: 'OWNER' } })
  }

  return NextResponse.json({ ok: true })
}