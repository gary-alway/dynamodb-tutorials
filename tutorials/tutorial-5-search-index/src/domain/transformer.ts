import { omit } from 'ramda'
import {
  CHAPTER_PREFIX,
  COURSE_PREFIX,
  STUDENT_PREFIX,
  TRACK_PREFIX
} from '../types'
import {
  attributeMapToValues,
  removePrefix,
  attributeValueToValue
} from '../utils'
import {
  AttributeMap,
  Chapter,
  ChapterProgress,
  Course,
  CourseProgress,
  Entity,
  Student,
  Track
} from '../types'

const SK = 'sk'
const GSI1_PK = 'gsi1_pk'
const GSI1_SK = 'gsi1_sk'
const GSI2_PK = 'gsi2_pk'
const GSI2_SK = 'gsi2_sk'

const dynamoRecordToStudent = (record: AttributeMap): Student => {
  const { pk, gsi1_pk, ...data } = record

  return omit([SK, GSI1_SK], {
    ...attributeMapToValues(data),
    id: removePrefix(attributeValueToValue<string>(pk), STUDENT_PREFIX),
    email: attributeValueToValue<string>(gsi1_pk)
  }) as unknown as Student
}

const dynamoRecordToTrack = (record: AttributeMap) => {
  const { pk, ...data } = record

  return omit([GSI1_PK, GSI1_SK, SK], {
    ...attributeMapToValues(data),
    id: removePrefix(attributeValueToValue<string>(pk), TRACK_PREFIX)
  }) as unknown as Track
}

const dynamoRecordToCourse = (record: AttributeMap) => {
  const { pk, sk, ...data } = record

  return omit([GSI1_PK, GSI1_SK], {
    ...attributeMapToValues(data),
    id: removePrefix(attributeValueToValue<string>(sk), COURSE_PREFIX),
    trackId: removePrefix(attributeValueToValue<string>(pk), TRACK_PREFIX)
  }) as unknown as Course
}

const dynamoRecordToChapter = (record: AttributeMap) => {
  const { pk, sk, gsi1_sk, ...data } = record

  return omit([GSI1_PK, GSI2_PK, GSI2_SK], {
    ...attributeMapToValues(data),
    id: removePrefix(attributeValueToValue<string>(sk), CHAPTER_PREFIX),
    courseId: removePrefix(
      attributeValueToValue<string>(gsi1_sk),
      COURSE_PREFIX
    ),
    trackId: removePrefix(attributeValueToValue<string>(pk), TRACK_PREFIX)
  }) as unknown as Chapter
}

const dynamoRecordToCourseProgress = (record: AttributeMap) => {
  const { pk, sk, ...data } = record

  return {
    ...attributeMapToValues(data),
    studentId: removePrefix(attributeValueToValue<string>(pk), STUDENT_PREFIX),
    courseId: removePrefix(attributeValueToValue<string>(sk), COURSE_PREFIX)
  } as unknown as CourseProgress
}

const dynamoRecordToChapterProgress = (record: AttributeMap) => {
  const { pk, sk, ...data } = record

  return {
    ...attributeMapToValues(data),
    studentId: removePrefix(attributeValueToValue<string>(pk), STUDENT_PREFIX),
    chapterId: removePrefix(attributeValueToValue<string>(sk), CHAPTER_PREFIX)
  } as unknown as ChapterProgress
}

const entityTransformMap: Record<string, (record: AttributeMap) => Entity> = {
  student: dynamoRecordToStudent,
  track: dynamoRecordToTrack,
  course: dynamoRecordToCourse,
  chapter: dynamoRecordToChapter,
  course_progress: dynamoRecordToCourseProgress,
  chapter_progress: dynamoRecordToChapterProgress
}

export const dynamoRecordToEntity = <T extends Entity>(
  record: AttributeMap
): T => {
  const { entityType } = record
  const _entityType = attributeValueToValue<string>(entityType)
  const transformer = entityTransformMap[_entityType]

  if (!transformer) {
    throw new Error(`Unknown entity type: ${_entityType}`)
  }

  return entityTransformMap[_entityType](record) as T
}
