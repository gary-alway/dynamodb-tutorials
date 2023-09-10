import { omit } from 'ramda'
import { STUDENT_PREFIX, TRACK_PREFIX } from '../client'
import {
  attributeMapToValues,
  removePrefix,
  attributeValueToValue
} from '../utils'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { AttributeMap, Student, Track } from '../types'

// const PK = 'pk'
const SK = 'sk'
const GSI1_PK = 'gsi1_pk'
const GSI1_SK = 'gsi1_sk'

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

export const dynamoRecordToEntity = <T extends Student | Track>(
  record: Record<string, AttributeValue>
): T => {
  const { entityType } = record
  const _entityType = attributeValueToValue(entityType)

  switch (_entityType) {
    case 'student':
      return dynamoRecordToStudent(record) as T
    case 'track':
      return dynamoRecordToTrack(record) as T
    default:
      throw new Error(`Unknown entity type ${_entityType}`)
  }
}
