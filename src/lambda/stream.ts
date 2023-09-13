import { DynamoDBStreamEvent, DynamoDBRecord, Handler } from 'aws-lambda'
import { updateStudentXp } from '../domain/student'

import {
  AttributeMap,
  ChapterProgress,
  CourseProgress,
  ENTITY_TYPES
} from '../types'
import { dynamoRecordToEntity } from '../domain/transformer'
import { getChapterById } from '../domain/chapter'
import { getCourseById } from '../domain/course'

const processRecord = async (record: DynamoDBRecord) => {
  switch (record.eventName) {
    case 'REMOVE':
      break
    default:
      if (record.dynamodb?.NewImage) {
        const entity = dynamoRecordToEntity(
          record.dynamodb?.NewImage as AttributeMap
        )

        if (entity.entityType === ENTITY_TYPES.chapter_progress) {
          const { studentId, chapterId, percent } = entity as ChapterProgress

          if (percent !== 100) {
            return
          }

          const chapter = await getChapterById(chapterId)
          if (chapter) {
            const { xp } = chapter

            console.log('updating student xp chapter', { studentId, xp })
            await updateStudentXp({ id: studentId, xp })
          }
        }

        if (entity.entityType === ENTITY_TYPES.course_progress) {
          const { studentId, courseId, percent } = entity as CourseProgress

          if (percent !== 100) {
            return
          }

          const course = await getCourseById(courseId)
          if (course) {
            const { xp } = course

            console.log('updating student xp for course', { studentId, xp })
            await updateStudentXp({ id: studentId, xp })
          }
        }
      }
      break
  }
}

export const handler: Handler = async (event: DynamoDBStreamEvent) => {
  await Promise.all(event.Records.map(processRecord))
}
