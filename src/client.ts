import { DynamoDB } from '@aws-sdk/client-dynamodb'

export const TABLE_NAME = 'demo-table'
export const REGION = 'eu-west-1'

export const dynamoClient = new DynamoDB({
  region: REGION,
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
})
