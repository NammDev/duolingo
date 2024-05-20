'use server'

import { cache } from 'react'
import { getCachedAuthUser } from './users'
import { getUserProgress } from './user-progress'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { challengeProgress, units } from '@/db/schema'

export const getCourseProgress = cache(async () => {
  const user = await getCachedAuthUser()
  if (!user) return null

  const userProgress = await getUserProgress()

  if (!user || !userProgress?.activeCourseId) return null

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, user.id),
              },
            },
          },
        },
      },
    },
  })

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((progress) => !progress.completed)
        )
      })
    })

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  }
})
