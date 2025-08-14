import Image from 'next/image'
import { headers } from 'next/headers'
import { prisma } from '@pkg/db'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const host = headers().get('host') || ''
  const slug = host.split(':')[0].split('.')[0] || 'acme'

  const product = await prisma.product.findFirst({
    where: { id: params.id, tenant: { slug } },
  })

  if (!product) {
    return (
      <div>
        <p>Product not found.</p>
        <Link href="/" className="text-blue-600 underline">Back</Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-square">
        <Image src={product.imageUrl || `https://picsum.photos/seed/${product.id}/800/800`} alt={product.title} fill className="object-cover rounded-lg" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="mt-2 text-xl font-semibold">${(product.priceCents/100).toFixed(2)} {product.currency}</div>
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{product.description}</p>
        <form action="#" className="mt-6">
          <button type="button" className="px-4 py-2 bg-black text-white rounded">Add to cart (demo)</button>
        </form>
      </div>
    </div>
  )
}