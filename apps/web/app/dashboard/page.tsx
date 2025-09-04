import Link from 'next/link'

export default async function DashboardIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <ul className="list-disc ml-6 text-blue-600">
        <li><Link href="/dashboard/stores">Stores</Link></li>
        <li><Link href="/dashboard/subscription">Subscription</Link></li>
        <li><Link href="/dashboard/reports/sales">Reports</Link></li>
      </ul>
    </div>
  )
}