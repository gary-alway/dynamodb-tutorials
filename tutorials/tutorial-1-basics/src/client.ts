import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb'

export const TABLE_NAME = 'demo-table'
export const REGION = 'eu-west-1'
export const dynamoClient = new DynamoDB({ region: REGION })

export const STUDENT_PREFIX = 'student#'

type AttributeMap = Record<string, AttributeValue>

const getItemKeyAndValue = (item: AttributeMap, key?: string) =>
  key ? { [`${key}`]: item[`${key}`] } : {}

export const truncateTable = async (
  client: DynamoDB,
  TableName: string,
  hash: string,
  range?: string
): Promise<void> => {
  const { Items } = await client.scan({ TableName })
  if (!Items) {
    return
  }
  const keys = Items.map((item: AttributeMap) => ({
    ...getItemKeyAndValue(item, hash),
    ...getItemKeyAndValue(item, range)
  }))
  if (!keys.length) {
    return
  }
  await Promise.all(keys?.map(Key => client.deleteItem({ TableName, Key })))
}
