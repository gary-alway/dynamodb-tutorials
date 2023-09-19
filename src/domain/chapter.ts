import { head, pathOr } from 'ramda'
import { valueToAttributeValue, addPrefix, valueOrNull } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { dynamoRecordToEntity } from './transformer'
import {
  CHAPTER_PREFIX,
  COURSE_PREFIX,
  Chapter,
  ENTITY_TYPES,
  TRACK_PREFIX
} from '../types'
import { getCourseById } from './course'
import { dynamoClient, TABLE_NAME } from '../clients/aws-clients'

export const getChapterById = (id: string): Promise<Chapter | null> =>
  dynamoClient
    .query({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression:
        '#gsi1_pk = :gsi1_pk and begins_with(#gsi1_sk, :gsi1_sk)',
      ExpressionAttributeNames: {
        '#gsi1_pk': 'gsi1_pk',
        '#gsi1_sk': 'gsi1_sk'
      },
      ExpressionAttributeValues: {
        ':gsi1_pk': valueToAttributeValue(addPrefix(id, CHAPTER_PREFIX)),
        ':gsi1_sk': valueToAttributeValue(COURSE_PREFIX)
      }
    })
    .then(res =>
      valueOrNull(
        head(
          pathOr([], ['Items'], res).map(c => dynamoRecordToEntity<Chapter>(c))
        )
      )
    )

export const getChaptersByCourseId = (courseId: string): Promise<Chapter[]> =>
  dynamoClient
    .query({
      TableName: TABLE_NAME,
      IndexName: 'gsi2',
      KeyConditionExpression:
        '#gsi2_pk = :gsi2_pk and begins_with(#gsi2_sk, :gsi2_sk)',
      ExpressionAttributeNames: {
        '#gsi2_pk': 'gsi2_pk',
        '#gsi2_sk': 'gsi2_sk'
      },
      ExpressionAttributeValues: {
        ':gsi2_pk': valueToAttributeValue(addPrefix(courseId, COURSE_PREFIX)),
        ':gsi2_sk': valueToAttributeValue(CHAPTER_PREFIX)
      }
    })
    .then(res => pathOr([], ['Items'], res).map(dynamoRecordToEntity<Chapter>))

export const saveChapter = async ({
  name,
  courseId,
  xp
}: {
  name: string
  courseId: string
  xp: number
}): Promise<string> => {
  const id = uuidv4()

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error('Course not found')
  }

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(course.trackId, TRACK_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, CHAPTER_PREFIX)),
      gsi1_pk: valueToAttributeValue(addPrefix(id, CHAPTER_PREFIX)),
      gsi1_sk: valueToAttributeValue(addPrefix(courseId, COURSE_PREFIX)),
      gsi2_pk: valueToAttributeValue(addPrefix(courseId, COURSE_PREFIX)),
      gsi2_sk: valueToAttributeValue(addPrefix(id, CHAPTER_PREFIX)),
      name: valueToAttributeValue(name),
      xp: valueToAttributeValue(xp),
      entityType: valueToAttributeValue(ENTITY_TYPES.chapter)
    }
  })

  return id
}
