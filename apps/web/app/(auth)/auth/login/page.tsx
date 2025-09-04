'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@acme.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    setLoading(false)
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError(res?.error || 'Invalid credentials')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <button disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </form>
  )
}