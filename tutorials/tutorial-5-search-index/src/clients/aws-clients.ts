import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

export const TABLE_NAME = 'demo-table'
export const REGION = 'eu-west-1'

export const dynamoClient = new DynamoDB({
  region: REGION,
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:8000' : undefined
})

const ssmClient = new SSMClient({ region: REGION })

export const getSsmParameter = async (paramName: string) => {
  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: true
  })

  const response = await ssmClient.send(command)
  const paramValue = response.Parameter?.Value

  if (!paramValue) {
    throw new Error(`Parameter ${paramName} not found`)
  }

  return paramValue
}
