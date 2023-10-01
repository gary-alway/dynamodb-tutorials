import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { SQSClient, ReceiveMessageCommand } from '@aws-sdk/client-sqs'

export const TABLE_NAME = 'demo-table'
export const REGION = 'eu-west-1'
const TopicArn = 'arn:aws:sns:eu-west-1:137374389243:demo-topic'
const QueueUrls = {
  legacy: 'https://sqs.eu-west-1.amazonaws.com/137374389243/legacy-queue',
  processor: 'https://sqs.eu-west-1.amazonaws.com/137374389243/processor-queue'
}

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

const snsClient = new SNSClient({ region: REGION })

export const publishSnsMessage = async (
  eventType: string,
  entity: Record<string, unknown>
) => {
  const Message = JSON.stringify({ Message: entity, EventType: eventType })
  const command = new PublishCommand({
    TopicArn,
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: eventType
      }
    },
    Message
  })
  await snsClient.send(command)
}

const sqsClient = new SQSClient({ region: REGION })

export const receiveSqsMessages = async (queue: keyof typeof QueueUrls) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: QueueUrls[queue],
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20
  })
  const response = await sqsClient.send(command)
  return response.Messages
}
