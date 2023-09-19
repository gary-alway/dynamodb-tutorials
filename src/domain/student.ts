import { head, pathOr } from 'ramda'
import { TABLE_NAME, dynamoClient } from '../clients/aws-clients'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, valueOrNull, valueToAttributeValue } from '../utils'
import { dynamoRecordToEntity } from './transformer'
import { Student, AttributeMap, STUDENT_PREFIX, ENTITY_TYPES } from '../types'

export const getStudentById = (id: string): Promise<Student | null> =>
  dynamoClient
    .getItem({
      TableName: TABLE_NAME,
      Key: {
        pk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX)),
        sk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX))
      }
    })
    .then(({ Item }) => {
      if (!Item) {
        return null
      }
      const _item = dynamoRecordToEntity<Student>(Item)
      return _item.deleted ? null : _item
    })

export const saveStudent = async ({
  firstName,
  lastName,
  email
}: {
  firstName: string
  lastName: string
  email: string
}): Promise<string> => {
  const _id = uuidv4()
  const _email = email.toLocaleLowerCase()
  const xp = 0

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(_id, STUDENT_PREFIX)),
      sk: valueToAttributeValue(addPrefix(_id, STUDENT_PREFIX)),
      gsi1_pk: valueToAttributeValue(_email),
      gsi1_sk: valueToAttributeValue(addPrefix(_id, STUDENT_PREFIX)),
      firstName: valueToAttributeValue(firstName),
      lastName: valueToAttributeValue(lastName),
      xp: valueToAttributeValue(xp),
      entityType: valueToAttributeValue(ENTITY_TYPES.student)
    }
  })

  return _id
}

export const updateStudent = async ({
  id,
  firstName,
  lastName,
  email
}: {
  id: string
  firstName?: string
  lastName?: string
  email?: string
}): Promise<void> => {
  const updateExpressionParts = []
  const ExpressionAttributeValues: AttributeMap = {}

  if (firstName !== undefined) {
    updateExpressionParts.push('#firstName = :firstName')
    ExpressionAttributeValues[':firstName'] = valueToAttributeValue(firstName)
  }

  if (lastName !== undefined) {
    updateExpressionParts.push('#lastName = :lastName')
    ExpressionAttributeValues[':lastName'] = valueToAttributeValue(lastName)
  }

  if (email !== undefined) {
    updateExpressionParts.push('#gsi1_pk = :gsi1_pk')
    ExpressionAttributeValues[':gsi1_pk'] = valueToAttributeValue(email)
  }

  const UpdateExpression = `SET ${updateExpressionParts.join(', ')}`

  const ExpressionAttributeNames = {
    ...(firstName && { '#firstName': 'firstName' }),
    ...(lastName && { '#lastName': 'lastName' }),
    ...(email && { '#gsi1_pk': 'gsi1_pk' })
  }

  await dynamoClient.updateItem({
    TableName: TABLE_NAME,
    Key: {
      pk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX))
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  })
}

export const deleteStudent = async (id: string): Promise<void> => {
  await dynamoClient.updateItem({
    TableName: TABLE_NAME,
    Key: {
      pk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX))
    },
    UpdateExpression: 'SET #deleted = :deleted',
    ExpressionAttributeNames: {
      '#deleted': 'deleted'
    },
    ExpressionAttributeValues: {
      ':deleted': valueToAttributeValue(true)
    }
  })
}

export const getStudentByEmail = (email: string): Promise<Student | null> =>
  dynamoClient
    .query({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1_pk = :gsi1_pk',
      ExpressionAttributeNames: {
        '#gsi1_pk': 'gsi1_pk'
      },
      ExpressionAttributeValues: {
        ':gsi1_pk': {
          S: email.toLocaleLowerCase()
        },
        ':notDeleted': {
          BOOL: false
        }
      },
      FilterExpression: 'attribute_not_exists(deleted) OR deleted = :notDeleted'
    })
    .then(res =>
      valueOrNull<Student>(
        head(pathOr([], ['Items'], res).map(dynamoRecordToEntity<Student>))
      )
    )

export const updateStudentXp = async ({
  id,
  xp
}: {
  id: string
  xp: number
}): Promise<void> => {
  await dynamoClient.updateItem({
    TableName: TABLE_NAME,
    Key: {
      pk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, STUDENT_PREFIX))
    },
    UpdateExpression: 'set xp = xp + :inc',
    ExpressionAttributeValues: {
      ':inc': valueToAttributeValue(xp)
    }
  })
}
