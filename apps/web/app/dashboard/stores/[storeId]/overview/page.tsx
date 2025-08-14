import { prisma } from '@pkg/db'
import { getSession } from '../../../../lib/session'

export default async function StoreOverviewPage({ params }: { params: { storeId: string } }) {
  const session = await getSession()
  if (!session?.user) return <p>Not authenticated.</p>
  const userId = (session.user as any).id as string

  const membership = await prisma.membership.findFirst({ where: { userId, tenantId: params.storeId }, include: { tenant: true } })
  if (!membership) return <p>Store not found.</p>

  const [productsCount, ordersCount] = await Promise.all([
    prisma.product.count({ where: { tenantId: params.storeId } }),
    prisma.order.count({ where: { tenantId: params.storeId } }),
  ])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{membership.tenant.name} Overview</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Products</div>
          <div className="text-2xl font-semibold">{productsCount}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Orders</div>
          <div className="text-2xl font-semibold">{ordersCount}</div>
        </div>
      </div>
    </div>
  )
}