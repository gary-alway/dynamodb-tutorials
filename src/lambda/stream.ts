import { DynamoDBStreamEvent, DynamoDBRecord, Handler } from 'aws-lambda'

import {
  AttributeMap,
  ENTITY_TYPES,
  LEGACY_EVENT_TYPES,
  isIndexableEntity,
  isProgressEntity
} from '../types'
import { dynamoRecordToEntity } from '../domain/transformer'
import { updateStudentProgress } from '../domain/progress'
import {
  deleteAlgoliaObject,
  getAlgoliaIndex,
  saveAlgoliaObject
} from '../clients/algolia-client'
import { SearchIndex } from 'algoliasearch'
import { publishSnsMessage } from '../clients/aws-clients'

const processRecord =
  (index: SearchIndex) => async (record: DynamoDBRecord) => {
    switch (record.eventName) {
      case 'REMOVE':
        if (record.dynamodb?.OldImage) {
          const entity = dynamoRecordToEntity(
            record.dynamodb?.OldImage as AttributeMap
          )
          if (isIndexableEntity(entity)) {
            await deleteAlgoliaObject(index, entity.id!)
          }
        }
        break
      default:
        if (record.dynamodb?.NewImage) {
          const entity = dynamoRecordToEntity(
            record.dynamodb?.NewImage as AttributeMap
          )

          if (isProgressEntity(entity)) {
            await updateStudentProgress(entity)
          } else if (isIndexableEntity(entity)) {
            if (entity.deleted) {
              await deleteAlgoliaObject(index, entity.id!)
            } else {
              await saveAlgoliaObject(index, entity)
            }
          }

          if (entity.entityType === ENTITY_TYPES.student) {
            await publishSnsMessage(LEGACY_EVENT_TYPES.student_update, entity)
          }
        }
        break
    }
  }

export const handler: Handler = async (event: DynamoDBStreamEvent) => {
  const algoliaIndex = await getAlgoliaIndex()
  await Promise.all(event.Records.map(processRecord(algoliaIndex)))
}
