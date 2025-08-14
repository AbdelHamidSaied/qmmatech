import { NextResponse } from 'next/server'
import { prisma } from '@pkg/db'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1` as unknown
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}