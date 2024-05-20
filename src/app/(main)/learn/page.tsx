import { FeedWrapper } from '@/components/layouts/feed-wrapper'
import { StickyWrapper } from '@/components/layouts/sticky-wrapper'
import { LearnHeader } from './_components/learn-header'
import { UserProgress } from '@/components/user-progress'
import { getUserProgress } from '@/lib/actions/user-progress'
import { redirect } from 'next/navigation'
import { getUnits } from '@/lib/actions/units'
import { Unit } from './_components/unit'
import { getCourseProgress } from '@/lib/actions/course-progress'
import { getLessonPercentage } from '@/lib/actions/lessons'
import { UnitBanner } from './_components/unit-banner'
import { getUserSubscription } from '@/lib/actions/user-subscription'

const LearnPage = async () => {
  const [userProgress, units, courseProgress, lessonPercentage, userSubscription] =
    await Promise.all([
      await getUserProgress(),
      // load all units of user ( bao gồm tất cả lessons có trong unit đó)
      await getUnits(),
      // load active lesson of user (bao gồm tất cả challenges có trong lesson đó và activeLesson thuộc unit nào)
      await getCourseProgress(),
      // Tính xem bao nhiêu % lesson đã hoàn thành
      await getLessonPercentage(),
      await getUserSubscription(),
    ])

  if (!courseProgress || !userProgress || !userProgress.activeCourse) redirect('/courses')

  const isPro = !!userSubscription?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />

        {/* {!isPro && <Promo />}
        <Quests points={userProgress.points} /> */}
      </StickyWrapper>
      <FeedWrapper>
        <LearnHeader title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className='mb-10'>
            <UnitBanner description={unit.description} title={unit.title} />
            <Unit
              id={unit.id}
              order={unit.order}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
