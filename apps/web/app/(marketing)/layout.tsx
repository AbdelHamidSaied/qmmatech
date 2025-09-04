import type { ReactNode } from 'react'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="max-w-4xl mx-auto p-8">
        {children}
      </div>
    </div>
  )
}