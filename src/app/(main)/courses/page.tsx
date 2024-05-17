import { getCourses } from '@/lib/actions/courses'
import { List } from './list'
import { getUserProgress } from '@/lib/actions/user-progress'

const CoursesPage = async () => {
  const [courses, userProgress] = await Promise.all([await getCourses(), await getUserProgress()])

  return (
    <div className='mx-auto h-full max-w-[912px] px-3'>
      <h1 className='text-2xl font-bold text-neutral-700'>Language Courses</h1>
      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  )
}

export default CoursesPage
