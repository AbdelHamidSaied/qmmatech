import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'

export async function GET() {
  const host = headers().get('host') || ''
  const slug = host.split(':')[0].split('.')[0] || 'acme'
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  return NextResponse.json({ tenant })
}