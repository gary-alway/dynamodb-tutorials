import {
  BASKET_PREFIX,
  CUSTOMER_PREFIX,
  TABLE_NAME,
  dynamoClient
} from '../client'
import { valueToAttributeValue, addPrefix } from '../utils'
import { v4 as uuidv4 } from 'uuid'

const entityType = 'basket'

export const createCustomerBasket = async ({
  customerId
}: {
  customerId: string
}): Promise<string> => {
  const id = uuidv4()

  await dynamoClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      pk: valueToAttributeValue(addPrefix(customerId, CUSTOMER_PREFIX)),
      sk: valueToAttributeValue(addPrefix(id, BASKET_PREFIX)),
      entityType: valueToAttributeValue(entityType)
    }
  })

  return id
}
