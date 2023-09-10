import { AttributeValue } from '@aws-sdk/client-dynamodb'

export type Student = {
  id?: string
  firstName: string
  lastName: string
  email: string
  xp: number
  deleted?: boolean
}

export type Track = {
  id?: string
  name: string
}

export type Entity = Student | Track

export type AttributeMap = Record<string, AttributeValue>
