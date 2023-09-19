import { TABLE_NAME, dynamoClient } from '../src/clients/aws-clients'
import { AttributeMap } from '../src/types'

const getItemKeyAndValue = (item: AttributeMap, key?: string) =>
  key ? { [`${key}`]: item[`${key}`] } : {}

export const truncateTable = async () => {
  const { Items } = await dynamoClient.scan({ TableName: TABLE_NAME })
  if (!Items) {
    return
  }
  const keys = Items.map((item: AttributeMap) => ({
    ...getItemKeyAndValue(item, 'pk'),
    ...getItemKeyAndValue(item, 'sk')
  }))
  if (!keys.length) {
    return
  }
  await Promise.all(
    keys?.map(Key => dynamoClient.deleteItem({ TableName: TABLE_NAME, Key }))
  )
}
