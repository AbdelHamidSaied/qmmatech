import { authOptions } from '../lib/auth'
import { getServerSession } from 'next-auth'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  return (
    <div>
      <h1 className="text-xl font-semibold">Profile</h1>
      <pre className="mt-2 text-sm bg-gray-100 p-3 rounded">{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}