import { TABLE_NAME, dynamoClient } from './client'
import { AttributeMap } from './types'

const getItemKeyAndValue = (item: AttributeMap, key?: string) =>
  key ? { [`${key}`]: item[`${key}`] } : {}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
Promise.resolve()
  .then(async () => {
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
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('done')
    process.exit(0)
  })
