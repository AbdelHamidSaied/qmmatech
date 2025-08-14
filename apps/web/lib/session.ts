import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function getSession() {
  return getServerSession(authOptions)
}