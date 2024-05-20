import Image from 'next/image'
import { redirect } from 'next/navigation'

import { UserProgress } from '@/components/user-progress'

import { Items } from './_components/items'
import { getUserProgress } from '@/lib/actions/user-progress'
import { getUserSubscription } from '@/lib/actions/user-subscription'
import { StickyWrapper } from '@/components/layouts/sticky-wrapper'
import { FeedWrapper } from '@/components/layouts/feed-wrapper'
import { Quests } from '@/components/quests'

const ShopPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    await getUserProgress(),
    await getUserSubscription(),
  ])

  if (!userProgress || !userProgress.activeCourse) redirect('/courses')

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

        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className='flex w-full flex-col items-center'>
          <Image src='/shop.svg' alt='Shop' height={90} width={90} />

          <h1 className='my-6 text-center text-2xl font-bold text-neutral-800'>Shop</h1>
          <p className='mb-6 text-center text-lg text-muted-foreground'>
            Spend your points on cool stuff.
          </p>

          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default ShopPage
