import {
  COURSE_PREFIX,
  STUDENT_PREFIX,
  TABLE_NAME,
  dynamoClient
} from '../client'
import { valueToAttributeValue, addPrefix } from '../utils'
import { getCourseById } from './course'
import { dynamoRecordToEntity } from './transformer'
import { CourseProgress } from '../types'

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
      entityType: valueToAttributeValue('course_progress'),
      percent: valueToAttributeValue<number>(percent)
    }
  })
}
