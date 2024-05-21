import { type NextRequest, NextResponse } from 'next/server'
import { units } from '@/db/schema'
import getIsAdmin from '@/lib/admin'
import { db } from '@/db'

export const GET = async () => {
  const isAdmin = getIsAdmin()
  if (!isAdmin) return new NextResponse('Unauthorized.', { status: 401 })

  const data = await db.query.units.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin()
  if (!isAdmin) return new NextResponse('Unauthorized.', { status: 401 })

  const body = (await req.json()) as typeof units.$inferSelect

  const data = await db
    .insert(units)
    .values({
      ...body,
    })
    .returning()

  return NextResponse.json(data[0])
}
