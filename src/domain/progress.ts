import { TABLE_NAME, dynamoClient } from '../client'
import { valueToAttributeValue, addPrefix } from '../utils'
import { getCourseById } from './course'
import { dynamoRecordToEntity } from './transformer'
import {
  CHAPTER_PREFIX,
  COURSE_PREFIX,
  ChapterProgress,
  CourseProgress,
  ENTITY_TYPES,
  STUDENT_PREFIX
} from '../types'
import { getChapterById } from './chapter'

export const getCourseProgress = async ({
  courseId,
  studentId
}: {
  courseId: string
  studentId: string
}): Promise<CourseProgress | null> =>
  dynamoClient
    .getItem({
      TableName: TABLE_NAME,
      Key: {
        pk: valueToAttributeValue(addPrefix(studentId, STUDENT_PREFIX)),
        sk: valueToAttributeValue(addPrefix(courseId, COURSE_PREFIX))
      }
    })
    .then(({ Item }) =>
      Item ? dynamoRecordToEntity<CourseProgress>(Item) : null
    )

export const saveCourseProgress = async ({
  courseId,
  studentId,
  percent
}: {
  courseId: string
  studentId: string
  percent: number
}) => {
  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error('Course not found')
  }

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(studentId, STUDENT_PREFIX)),
      sk: valueToAttributeValue(addPrefix(courseId, COURSE_PREFIX)),
      entityType: valueToAttributeValue(ENTITY_TYPES.course_progress),
      percent: valueToAttributeValue<number>(percent)
    }
  })
}

export const getChapterProgress = async ({
  chapterId,
  studentId
}: {
  chapterId: string
  studentId: string
}): Promise<ChapterProgress | null> =>
  dynamoClient
    .getItem({
      TableName: TABLE_NAME,
      Key: {
        pk: valueToAttributeValue(addPrefix(studentId, STUDENT_PREFIX)),
        sk: valueToAttributeValue(addPrefix(chapterId, CHAPTER_PREFIX))
      }
    })
    .then(({ Item }) =>
      Item ? dynamoRecordToEntity<ChapterProgress>(Item) : null
    )

export const chapterComplete = async ({
  chapterId,
  studentId
}: {
  chapterId: string
  studentId: string
}) => {
  const chapter = await getChapterById(chapterId)

  if (!chapter) {
    throw new Error('Chapter not found')
  }

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(studentId, STUDENT_PREFIX)),
      sk: valueToAttributeValue(addPrefix(chapterId, CHAPTER_PREFIX)),
      entityType: valueToAttributeValue(ENTITY_TYPES.chapter_progress),
      percent: valueToAttributeValue(100)
    }
  })
}
