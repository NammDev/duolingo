import { FeedWrapper } from '@/components/layouts/feed-wrapper'
import { StickyWrapper } from '@/components/layouts/sticky-wrapper'
import { LearnHeader } from './_components/learn-header'
import { UserProgress } from '@/components/user-progress'
import { getUserProgress } from '@/lib/actions/user-progress'
import { redirect } from 'next/navigation'

const LearnPage = async () => {
  // const [userProgress, units, courseProgress, lessonPercentage, userSubscription] =
  //   await Promise.all([
  //     await getUserProgress(),
  //     await getCourseProgress(),
  //     await getLessonPercentage(),
  //     await getUnits(),
  //     await getUserSubscription(),
  //   ])

  const userProgress = await getUserProgress()
  // if (!courseProgress || !userProgress || !userProgress.activeCourse) redirect('/courses')
  if (!userProgress || !userProgress.activeCourse) redirect('/courses')

  // const isPro = !!userSubscription?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <h1>User Progress</h1>

        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          // hasActiveSubscription={isPro}
          hasActiveSubscription={false}
        />
        {/* {!isPro && <Promo />}
        <Quests points={userProgress.points} /> */}
      </StickyWrapper>
      <FeedWrapper>
        <LearnHeader title={userProgress.activeCourse.title} />
        <div className='space-y-4'>
          <div className='h-[700px] bg-blue-200 w-full' />
          <div className='h-[700px] bg-blue-200 w-full' />
          <div className='h-[700px] bg-blue-200 w-full' />
          <div className='h-[700px] bg-blue-200 w-full' />
        </div>
        {/* {units.map((unit) => (
          <div key={unit.id} className='mb-10'>
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))} */}
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
