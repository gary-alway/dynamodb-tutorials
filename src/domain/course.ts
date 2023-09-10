import { head, pathOr } from 'ramda'
import {
  COURSE_PREFIX,
  TABLE_NAME,
  TRACK_PREFIX,
  dynamoClient
} from '../client'
import {
  removePrefix,
  valueToAttributeValue,
  addPrefix,
  valueOrNull
} from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { dynamoRecordToEntity } from './transformer'
import { Course } from '../types'

export const getCourseById = async (id: string): Promise<Course | null> =>
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
        ':gsi1_pk': valueToAttributeValue(
          addPrefix(removePrefix(id, COURSE_PREFIX), COURSE_PREFIX)
        ),
        ':gsi1_sk': valueToAttributeValue(TRACK_PREFIX)
      }
    })
    .then(res =>
      valueOrNull(
        head(
          pathOr([], ['Items'], res).map(c => dynamoRecordToEntity<Course>(c))
        )
      )
    )

export const getCoursesByTrackId = async (trackId: string): Promise<Course[]> =>
  dynamoClient
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': valueToAttributeValue(addPrefix(trackId, TRACK_PREFIX)),
        ':sk': valueToAttributeValue(COURSE_PREFIX)
      }
    })
    .then(res => pathOr([], ['Items'], res).map(dynamoRecordToEntity<Course>))

export const saveCourse = async ({
  name,
  trackId,
  xp
}: {
  name: string
  trackId: string
  xp: number
}): Promise<string> => {
  const id = uuidv4()
  const _trackId = removePrefix(trackId, TRACK_PREFIX)

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(_trackId, TRACK_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, COURSE_PREFIX)),
      gsi1_pk: valueToAttributeValue(addPrefix(id, COURSE_PREFIX)),
      gsi1_sk: valueToAttributeValue(addPrefix(_trackId, TRACK_PREFIX)),
      name: valueToAttributeValue(name),
      xp: valueToAttributeValue(xp),
      entityType: valueToAttributeValue('course')
    }
  })

  return id
}
