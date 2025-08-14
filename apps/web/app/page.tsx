import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { prisma } from '@pkg/db'

export default async function HomePage() {
  const host = headers().get('host') || ''
  const slug = host.split(':')[0].split('.')[0] || 'acme'
  const products = await prisma.product.findMany({
    where: { tenant: { slug }, active: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`} className="border rounded-lg overflow-hidden group">
          <div className="relative aspect-square">
            <Image src={p.imageUrl || `https://picsum.photos/seed/${p.id}/600/600`} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform" />
          </div>
          <div className="p-4">
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
            <div className="mt-2 font-semibold">${(p.priceCents/100).toFixed(2)} {p.currency}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}