import Link from 'next/link'
import { headers } from 'next/headers'
import { prisma } from '@pkg/db'

export default async function DashboardPage() {
  const host = headers().get('host') || ''
  const slug = host.split(':')[0].split('.')[0] || 'acme'

  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  const products = await prisma.product.findMany({ where: { tenant: { slug } }, orderBy: { createdAt: 'desc' } })
  const orders = await prisma.order.findMany({ where: { tenant: { slug } }, orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{tenant?.name} Dashboard</h1>
        <p className="text-gray-600">Quick overview of products and orders.</p>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Products</h2>
          <Link href="/dashboard/products/new" className="text-blue-600 underline">Add product</Link>
        </div>
        <ul className="mt-2 divide-y">
          {products.map(p => (
            <li key={p.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">${(p.priceCents/100).toFixed(2)} {p.currency}</div>
              </div>
              <Link href={`/product/${p.id}`} className="text-sm text-blue-600 underline">View</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-medium">Recent Orders</h2>
        <ul className="mt-2 divide-y">
          {orders.length === 0 && <li className="py-2 text-gray-600">No orders yet</li>}
          {orders.map(o => (
            <li key={o.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{o.email}</div>
                <div className="text-sm text-gray-600">${(o.totalCents/100).toFixed(2)} {o.currency} • {o.status}</div>
              </div>
              <span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}