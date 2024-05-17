'use server'

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
