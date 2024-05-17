'use server'

import { db } from '@/db'
import { cache } from 'react'
import { getCachedAuthUser } from './users'
import { eq } from 'drizzle-orm'
import { userProgress } from '@/db/schema'
import { getCourseById } from './courses'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const getUserProgress = cache(async () => {
  const user = await getCachedAuthUser()
  if (!user) return null

  return await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, user.id),
    with: {
      activeCourse: true,
    },
  })
})

export const upsertUserProgress = async (courseId: number) => {
  const user = await getCachedAuthUser()
  if (!user) throw new Error('Unauthorized.')

  const course = await getCourseById(courseId)
  if (!course) throw new Error('Course not found.')

  if (!course.units.length || !course.units[0].lessons.length) throw new Error('Course is empty.')

  const existingUserProgress = await getUserProgress()

  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || 'User',
      userImageSrc: user.imageUrl || '/mascot.svg',
    })
  } else {
    await db.insert(userProgress).values({
      userId: user.id,
      activeCourseId: courseId,
      userName: user.firstName || 'User',
      userImageSrc: user.imageUrl || '/mascot.svg',
    })
  }

  // break the cache for the user progress
  revalidatePath('/courses')
  revalidatePath('/learn')
  redirect('/learn')
}
