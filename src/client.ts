import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { AttributeMap } from './types'

export const TABLE_NAME = 'demo-table'
export const REGION = 'eu-west-1'

export const dynamoClient = new DynamoDB({
  region: REGION,
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
})

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
