'use server'

import { cache } from 'react'
import { getCachedAuthUser } from './users'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { userSubscription } from '@/db/schema'
import { absoluteUrl } from '@/lib/utils'
import { stripe } from '../stripe'

const DAY_IN_MS = 86_400_000
const returnUrl = absoluteUrl('/shop')

export const getUserSubscription = cache(async () => {
  const user = await getCachedAuthUser()
  if (!user) return null

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, user.id),
  })

  if (!data) return null

  const isActive =
    data.stripePriceId && data.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now()

  return {
    ...data,
    isActive: !!isActive,
  }
})

export const createStripeUrl = async () => {
  const user = await getCachedAuthUser()
  if (!user) throw new Error('Unauthorized.')

  const userSubscription = await getUserSubscription()

  // redirect user to customer portal who already have a subscription
  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    })

    return { data: stripeSession.url }
  }

  // checkout
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Lingo Pro',
            description: 'Unlimited hearts.',
          },
          unit_amount: 2000, // $20.00 USD
          recurring: {
            interval: 'month',
          },
        },
      },
    ],
    metadata: {
      userId: user.id,
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  })

  return { data: stripeSession.url }
}
