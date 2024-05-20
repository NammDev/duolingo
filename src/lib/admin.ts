import { User, currentUser } from '@clerk/nextjs/server'

export default async function getIsAdmin() {
  const user = await currentUser()
  const email = getUserEmail(user)
  const adminIds = process.env.CLERK_ADMIN_IDS!.split(', ') // stored in .env.local file as string separated by comma(,) and space( )

  if (!user) return false

  return adminIds.indexOf(email) !== -1
}

export function getUserEmail(user: User | null) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? ''

  return email
}
