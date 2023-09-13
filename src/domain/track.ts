import { pathOr } from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, valueToAttributeValue } from '../utils'
import { TABLE_NAME, dynamoClient as client } from '../client'
import { dynamoRecordToEntity } from './transformer'
import { ENTITY_TYPES, TRACK_PREFIX, Track } from '../types'

const entityType = ENTITY_TYPES.track

export const getTrackById = async (id: string): Promise<Track | null> =>
  client
    .getItem({
      TableName: TABLE_NAME,
      Key: {
        pk: valueToAttributeValue(addPrefix(id, TRACK_PREFIX)),
        sk: valueToAttributeValue(addPrefix(id, TRACK_PREFIX))
      }
    })
    .then(({ Item }) => (Item ? dynamoRecordToEntity<Track>(Item) : null))

export const getTracks = async (): Promise<Track[]> =>
  client
    .query({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1_pk = :gsi1_pk',
      ExpressionAttributeNames: {
        '#gsi1_pk': 'gsi1_pk'
      },
      ExpressionAttributeValues: {
        ':gsi1_pk': valueToAttributeValue(entityType)
      }
    })
    .then(res => pathOr([], ['Items'], res).map(dynamoRecordToEntity<Track>))

export const saveTrack = async ({
  name,
  xp
}: {
  name: string
  xp: number
}): Promise<string> => {
  const id = uuidv4()

  await client.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(id, TRACK_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, TRACK_PREFIX)),
      gsi1_pk: valueToAttributeValue(entityType),
      gsi1_sk: valueToAttributeValue(addPrefix(id, TRACK_PREFIX)),
      name: valueToAttributeValue(name),
      entityType: valueToAttributeValue(entityType),
      xp: valueToAttributeValue(xp)
    }
  })

  return id
}
