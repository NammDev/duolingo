'use server'

import { db } from '@/db'
import { getCachedAuthUser } from './users'
import { and, eq } from 'drizzle-orm'
import { challengeProgress, challenges, userProgress } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { getUserSubscription } from './user-subscription'
import { getUserProgress } from './user-progress'
import { MAX_HEARTS } from '../../../constants'

export const upsertChallengeProgress = async (challengeId: number) => {
  const user = await getCachedAuthUser()
  if (!user) throw new Error('Unauthorized.')

  const currentUserProgress = await getUserProgress()
  const userSubscription = await getUserSubscription()

  if (!currentUserProgress) throw new Error('User progress not found.')

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  })

  if (!challenge) throw new Error('Challenge not found.')

  const lessonId = challenge.lessonId

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, user.id),
      eq(challengeProgress.challengeId, challengeId)
    ),
  })

  const isPractice = !!existingChallengeProgress

  if (currentUserProgress.hearts === 0 && !isPractice && !userSubscription?.isActive)
    return { error: 'hearts' }

  if (isPractice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existingChallengeProgress.id))

    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, MAX_HEARTS),
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, user.id))

    revalidatePath('/learn')
    revalidatePath('/lesson')
    revalidatePath('/quests')
    revalidatePath('/leaderboard')
    revalidatePath(`/lesson/${lessonId}`)
    return
  }

  await db.insert(challengeProgress).values({
    challengeId,
    userId: user.id,
    completed: true,
  })

  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, user.id))

  revalidatePath('/learn')
  revalidatePath('/lesson')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
  revalidatePath(`/lesson/${lessonId}`)
}
