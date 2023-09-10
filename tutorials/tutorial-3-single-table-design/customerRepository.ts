import { CUSTOMER_PREFIX, TABLE_NAME, dynamoClient } from '../client'
import { removePrefix, valueToAttributeValue, addPrefix } from '../utils'
import { v4 as uuidv4 } from 'uuid'

const entityType = 'customer'

export const saveCustomer = async ({
  id,
  name,
  email,
  cardNumber
}: {
  id?: string
  name: string
  email: string
  cardNumber: number
}): Promise<string> => {
  const _id = id ? removePrefix(id, CUSTOMER_PREFIX) : uuidv4()

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(_id, CUSTOMER_PREFIX)),
      sk: valueToAttributeValue(addPrefix(_id, CUSTOMER_PREFIX)),
      name: valueToAttributeValue(name),
      email: valueToAttributeValue(email),
      cardNumber: valueToAttributeValue(cardNumber),
      entityType: valueToAttributeValue(entityType),
      gsi1_pk: valueToAttributeValue(email),
      gsi1_sk: valueToAttributeValue(entityType)
    }
  })

  return _id
}

export const getCustomerByEmail = async (email: string) =>
  dynamoClient
    .query({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1_pk = :email AND gsi1_sk = :entityType',
      ExpressionAttributeValues: {
        ':email': valueToAttributeValue(email),
        ':entityType': valueToAttributeValue(entityType)
      }
    })
    .then(({ Items }) => Items?.[0])

export const getAllCustomerRecords = async (id: string) =>
  dynamoClient
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk=:pk',
      ExpressionAttributeValues: {
        ':pk': valueToAttributeValue(addPrefix(id, CUSTOMER_PREFIX))
      }
    })
    .then(result => result.Items)
