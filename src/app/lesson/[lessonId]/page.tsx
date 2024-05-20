import { redirect } from 'next/navigation'
import { Quiz } from '../_components/quiz'
import { getLesson } from '@/lib/actions/lessons'
import { getUserProgress } from '@/lib/actions/user-progress'
import { getUserSubscription } from '@/lib/actions/user-subscription'

type LessonIdPageProps = {
  params: {
    lessonId: number
  }
}

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const [lesson, userProgress, userSubscription] = await Promise.all([
    await getLesson(params.lessonId),
    await getUserProgress(),
    await getUserSubscription(),
  ])

  if (!lesson || !userProgress) return redirect('/learn')

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  )
}

export default LessonIdPage
