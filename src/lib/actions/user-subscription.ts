'use server'

import { cache } from 'react'
import { getCachedAuthUser } from './users'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { userSubscription } from '@/db/schema'

const DAY_IN_MS = 86_400_000

export const getUserSubscription = cache(async () => {
  const user = await getCachedAuthUser()
  if (!user) return null

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, user.id),
  })

  if (!data) return null

  const isActive =
    data.stripePriceId && data.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now()

  return {
    ...data,
    isActive: !!isActive,
  }
})
