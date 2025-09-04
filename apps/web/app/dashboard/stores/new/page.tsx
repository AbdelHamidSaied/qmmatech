'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewStorePage() {
  const router = useRouter()
  const [name, setName] = useState('My Store')
  const [slug, setSlug] = useState('mystore')
  const [status, setStatus] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Creating...')
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      router.push(`/dashboard/stores/${data.tenant.id}/overview`)
    } else {
      setStatus(data.error || 'Error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">Create Store</h1>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input value={slug} onChange={e=>setSlug(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <button className="px-4 py-2 bg-black text-white rounded">Create</button>
      <div className="text-sm">{status}</div>
    </form>
  )
}