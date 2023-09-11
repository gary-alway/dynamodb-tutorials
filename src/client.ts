import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { AttributeMap } from './types'

export const TABLE_NAME = 'demo-table'
export const REGION = 'eu-west-1'

export const dynamoClient = new DynamoDB({
  region: REGION,
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
})

export const STUDENT_PREFIX = 'student#'
export const TRACK_PREFIX = 'track#'
export const COURSE_PREFIX = 'course#'
export const CHAPTER_PREFIX = 'chapter#'

export const PK = 'pk'
export const SK = 'sk'
export const GSI1_PK = 'gsi1_pk'
export const GSI1_SK = 'gsi1_sk'
export const GSI2_PK = 'gsi2_pk'
export const GSI2_SK = 'gsi2_sk'

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
