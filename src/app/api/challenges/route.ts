import { type NextRequest, NextResponse } from 'next/server'

import { challenges } from '@/db/schema'
import getIsAdmin from '@/lib/admin'
import { db } from '@/db'

export const GET = async () => {
  const isAdmin = getIsAdmin()
  if (!isAdmin) return new NextResponse('Unauthorized.', { status: 401 })

  const data = await db.query.challenges.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin()
  if (!isAdmin) return new NextResponse('Unauthorized.', { status: 401 })

  const body = (await req.json()) as typeof challenges.$inferSelect

  const data = await db
    .insert(challenges)
    .values({
      ...body,
    })
    .returning()

  return NextResponse.json(data[0])
}
