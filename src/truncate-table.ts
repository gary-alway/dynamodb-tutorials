import { TABLE_NAME, dynamoClient, truncateTable } from './client'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
Promise.resolve()
  .then(async () => {
    await truncateTable(dynamoClient, TABLE_NAME, 'pk', 'sk')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('done')
    process.exit(0)
  })
