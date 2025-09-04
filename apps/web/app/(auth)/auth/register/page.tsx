'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Registering...')
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      setStatus('Registered! Redirecting...')
      setTimeout(() => router.push('/auth/login'), 800)
    } else {
      const data = await res.json().catch(() => ({}))
      setStatus(data.error || 'Error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Register</h1>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <button className="px-4 py-2 bg-black text-white rounded">Create account</button>
      <div className="text-sm">{status}</div>
    </form>
  )
}