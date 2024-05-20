'use server'

import { db } from '@/db'
import { currentUser } from '@clerk/nextjs/server'
import { unstable_noStore as noStore } from 'next/cache'
import { cache } from 'react'

export const getCachedAuthUser = cache(async () => {
  noStore()
  try {
    return await currentUser()
  } catch (err) {
    console.error(err)
    return null
  }
})

export const getTopTenUsers = cache(async () => {
  const user = await getCachedAuthUser()
  if (!user) return []

  return await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  })
})
