'use client'

import { useState } from 'react'

export default function NewProductPage() {
  const [status, setStatus] = useState('')

  async function createProduct(formData: FormData) {
    setStatus('Saving...')
    const res = await fetch('/dashboard/products/new', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (res.ok) {
      setStatus('Created!')
    } else {
      setStatus(data.error || 'Error')
    }
  }

  return (
    <form action={createProduct} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Price (USD)</label>
        <input type="number" step="0.01" name="price" required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <input type="url" name="imageUrl" className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <button className="px-4 py-2 bg-black text-white rounded">Create</button>
      <span className="ml-3 text-sm">{status}</span>
    </form>
  )
}