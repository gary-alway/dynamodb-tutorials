import { truncateTable } from './truncate-table'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
Promise.resolve()
  .then(async () => {
    await truncateTable()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('truncate table complete')
    process.exit(0)
  })
