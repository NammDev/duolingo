import { lessons, units } from '@/db/schema'
import { LessonButton } from './lesson-button'

type UnitProps = {
  id: number
  order: number
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean
  })[]
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect
      })
    | undefined
  activeLessonPercentage: number
}

export const Unit = ({ lessons, activeLesson, activeLessonPercentage }: UnitProps) => {
  return (
    <div className='relative flex flex-col items-center'>
      {lessons.map((lesson, i) => {
        const isCurrent = lesson.id === activeLesson?.id
        const isLocked = !lesson.completed && !isCurrent

        return (
          <LessonButton
            key={lesson.id}
            id={lesson.id}
            index={i}
            totalCount={lessons.length - 1}
            current={isCurrent}
            locked={isLocked}
            percentage={activeLessonPercentage}
          />
        )
      })}
    </div>
  )
}
