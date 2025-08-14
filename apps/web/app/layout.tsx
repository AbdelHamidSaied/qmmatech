import './globals.css'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { prisma } from '@pkg/db'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const host = headers().get('host') || ''
  const slug = host.split(':')[0].split('.')[0] || 'acme'
  const tenant = await prisma.tenant.findUnique({ where: { slug } })

  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold">{tenant?.name ?? 'Store'}</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}