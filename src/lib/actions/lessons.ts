'use server'

import { db } from '@/db'
import { cache } from 'react'
import { getCachedAuthUser } from './users'
import { eq } from 'drizzle-orm'
import { challengeProgress, lessons, userProgress } from '@/db/schema'
import { getCourseProgress } from './course-progress'

export const getLesson = cache(async (id?: number) => {
  const user = await getCachedAuthUser()
  if (!user) return null

  const courseProgress = await getCourseProgress()
  const lessonId = id || courseProgress?.activeLessonId

  if (!lessonId) return null

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, user.id),
          },
        },
      },
    },
  })

  if (!data || !data.challenges) return null

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed)

    return { ...challenge, completed }
  })

  return { ...data, challenges: normalizedChallenges }
})

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress()
  if (!courseProgress?.activeLessonId) return 0

  const lesson = await getLesson(courseProgress?.activeLessonId)
  if (!lesson) return 0

  const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed)
  const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100)
  return percentage
})
