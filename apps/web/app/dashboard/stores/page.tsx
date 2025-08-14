import Link from 'next/link'
import { prisma } from '@pkg/db'
import { getSession } from '../../lib/session'

export default async function StoresListPage() {
  const session = await getSession()
  if (!session?.user) {
    return <p>Not authenticated.</p>
  }
  const userId = (session.user as any).id as string

  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { tenant: true },
    orderBy: { tenant: { createdAt: 'desc' } },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Stores</h1>
        <Link href="/dashboard/stores/new" className="text-blue-600 underline">New store</Link>
      </div>
      <ul className="divide-y">
        {memberships.map(m => (
          <li key={m.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{m.tenant.name}</div>
              <div className="text-sm text-gray-600">{m.role} • {m.tenant.slug}</div>
            </div>
            <Link href={`/dashboard/stores/${m.tenantId}/overview`} className="text-sm text-blue-600 underline">Open</Link>
          </li>
        ))}
        {memberships.length === 0 && <li className="py-6 text-gray-600">No stores yet</li>}
      </ul>
    </div>
  )
}