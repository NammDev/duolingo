import { type NextRequest, NextResponse } from 'next/server'

import { lessons } from '@/db/schema'
import getIsAdmin from '@/lib/admin'
import { db } from '@/db'

export const GET = async () => {
  const isAdmin = getIsAdmin()
  if (!isAdmin) return new NextResponse('Unauthorized.', { status: 401 })

  const data = await db.query.lessons.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin()
  if (!isAdmin) return new NextResponse('Unauthorized.', { status: 401 })

  const body = (await req.json()) as typeof lessons.$inferSelect

  const data = await db
    .insert(lessons)
    .values({
      ...body,
    })
    .returning()

  return NextResponse.json(data[0])
}
