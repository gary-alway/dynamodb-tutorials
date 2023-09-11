import { omit } from 'ramda'
import {
  CHAPTER_PREFIX,
  COURSE_PREFIX,
  GSI1_PK,
  GSI1_SK,
  GSI2_PK,
  GSI2_SK,
  SK,
  STUDENT_PREFIX,
  TRACK_PREFIX
} from '../client'
import {
  attributeMapToValues,
  removePrefix,
  attributeValueToValue
} from '../utils'
import { AttributeMap, Chapter, Course, Entity, Student, Track } from '../types'

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

export const dynamoRecordToEntity = <T extends Entity>(
  record: AttributeMap
): T => {
  const { entityType } = record
  const _entityType = attributeValueToValue(entityType)

  switch (_entityType) {
    case 'student':
      return dynamoRecordToStudent(record) as T
    case 'track':
      return dynamoRecordToTrack(record) as T
    case 'course':
      return dynamoRecordToCourse(record) as T
    case 'chapter':
      return dynamoRecordToChapter(record) as T
    default:
      throw new Error(`Unknown entity type ${_entityType}`)
  }
}
