'use server'

import { cache } from 'react'
import { getUserProgress } from './user-progress'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { challengeProgress, units } from '@/db/schema'
import { getCachedAuthUser } from './users'

// get Units of active course of user
export const getUnits = cache(async () => {
  const user = await getCachedAuthUser()
  const userProgress = await getUserProgress()

  if (!user || !userProgress?.activeCourseId) return []

  const allUnits = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    orderBy: (units, { asc }) => [asc(units.order)],
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
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

  const normalizedData = allUnits.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) return { ...lesson, completed: false }
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        )
      })
      return { ...lesson, completed: allCompletedChallenges }
    })
    return { ...unit, lessons: lessonsWithCompletedStatus }
  })

  return normalizedData
})
