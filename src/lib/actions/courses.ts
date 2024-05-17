'use server'

import { db } from '@/db'
import { courses } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cache } from 'react'

export const getCourses = cache(async () => {
  return await db.query.courses.findMany()
})

export const getCourseById = cache(async (courseId: number) => {
  return await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  })
})
