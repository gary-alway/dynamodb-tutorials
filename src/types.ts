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
  xp: number
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

export type CourseProgress = {
  studentId: string
  courseId: string
  percent: number
}

export type ChapterProgress = {
  studentId: string
  chapterId: string
  percent: number
}

export type Entity =
  | Student
  | Track
  | Course
  | Chapter
  | CourseProgress
  | ChapterProgress

export type AttributeMap = Record<string, AttributeValue>

export const STUDENT_PREFIX = 'student#'
export const TRACK_PREFIX = 'track#'
export const COURSE_PREFIX = 'course#'
export const CHAPTER_PREFIX = 'chapter#'
