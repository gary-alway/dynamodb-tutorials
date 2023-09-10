import { omit } from 'ramda'
import { STUDENT_PREFIX } from '../client'
import {
  attributeMapToValues,
  removePrefix,
  attributeValueToValue
} from '../utils'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

const dynamoRecordToStudent = (
  record: Record<string, AttributeValue>
): Student => {
  const { pk, gsi1_pk, ...data } = record

  return omit(['sk', 'gsi1_sk'], {
    ...attributeMapToValues(data),
    id: removePrefix(attributeValueToValue<string>(pk), STUDENT_PREFIX),
    email: attributeValueToValue<string>(gsi1_pk)
  }) as unknown as Student
}

export const dynamoRecordToEntity = <T extends Student>(
  record: Record<string, AttributeValue>
): T => {
  const { entityType } = record
  const _entityType = attributeValueToValue(entityType)

  switch (_entityType) {
    case 'student':
      return dynamoRecordToStudent(record) as T
    default:
      throw new Error(`Unknown entity type ${_entityType}`)
  }
}
