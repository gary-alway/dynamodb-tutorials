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
  // todo: add XP reward for track completion
}

export type Course = {
  id?: string
  name: string
  trackId: string
  xp: number
}

export type Chapter = {
  id?: string
  name: string
  trackId: string
  courseId: string
  xp: number
}

export type Entity = Student | Track | Course | Chapter

export type AttributeMap = Record<string, AttributeValue>
