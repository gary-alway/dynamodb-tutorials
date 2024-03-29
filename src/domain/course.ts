import { head, pathOr } from 'ramda'
import { valueToAttributeValue, addPrefix, valueOrNull } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { dynamoRecordToEntity } from './transformer'
import { COURSE_PREFIX, Course, ENTITY_TYPES, TRACK_PREFIX } from '../types'
import { dynamoClient, TABLE_NAME } from '../clients/aws-clients'

export const getCourseById = (id: string): Promise<Course | null> =>
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
        ':gsi1_pk': valueToAttributeValue(addPrefix(id, COURSE_PREFIX)),
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

export const getCoursesByTrackId = (trackId: string): Promise<Course[]> =>
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

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(trackId, TRACK_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, COURSE_PREFIX)),
      gsi1_pk: valueToAttributeValue(addPrefix(id, COURSE_PREFIX)),
      gsi1_sk: valueToAttributeValue(addPrefix(trackId, TRACK_PREFIX)),
      name: valueToAttributeValue(name),
      xp: valueToAttributeValue(xp),
      entityType: valueToAttributeValue(ENTITY_TYPES.course)
    }
  })

  return id
}
