import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'
import { getStoreSlugFromHost } from '../../lib/tenant'

export async function GET() {
  const host = headers().get('host')
  const slug = getStoreSlugFromHost(host)
  const products = await prisma.product.findMany({ where: { tenant: { slug }, active: true } })
  return new NextResponse(JSON.stringify({ products }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=600',
    },
  })
}