import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'
import { getStoreSlugFromHost } from '../../lib/tenant'

export async function GET() {
  const host = headers().get('host')
  const slug = getStoreSlugFromHost(host)
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  return NextResponse.json({ tenant })
}