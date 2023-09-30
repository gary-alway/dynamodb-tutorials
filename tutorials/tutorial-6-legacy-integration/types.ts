import { AttributeValue } from '@aws-sdk/client-dynamodb'

export const EXTERNAL_EVENT_TYPES = {
  course_completed: 'CourseComplete',
  chapter_completed: 'ChapterComplete'
}

export const LEGACY_EVENT_TYPES = {
  student_update: 'StudentUpdate'
}

export const ENTITY_TYPES = {
  student: 'student',
  track: 'track',
  course: 'course',
  chapter: 'chapter',
  course_progress: 'course_progress',
  chapter_progress: 'chapter_progress'
}

export type EntityName = keyof typeof ENTITY_TYPES

type EntityType = {
  entityType: EntityName
  id?: string
  deleted?: boolean
}

export type Student = EntityType & {
  firstName: string
  lastName: string
  email: string
  xp: number
}

export type Track = EntityType & {
  name: string
  xp: number
}

export type Course = EntityType & {
  name: string
  trackId: string
  xp: number
}

export type Chapter = EntityType & {
  name: string
  trackId: string
  courseId: string
  xp: number
}

export type CourseProgress = Omit<EntityType, 'id'> & {
  studentId: string
  courseId: string
  percent: number
}

export type ChapterProgress = Omit<EntityType, 'id'> & {
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

export type IndexableEntity = Student | Track | Course | Chapter

export type ProgressEntity = CourseProgress | ChapterProgress

export type AttributeMap = Record<string, AttributeValue>

export const STUDENT_PREFIX = 'student#'
export const TRACK_PREFIX = 'track#'
export const COURSE_PREFIX = 'course#'
export const CHAPTER_PREFIX = 'chapter#'

export function isProgressEntity(entity: Entity): entity is ProgressEntity {
  return (
    entity.entityType === ENTITY_TYPES.course_progress ||
    entity.entityType === ENTITY_TYPES.chapter_progress
  )
}

export function isIndexableEntity(entity: Entity): entity is IndexableEntity {
  return (
    entity.entityType === ENTITY_TYPES.student ||
    entity.entityType === ENTITY_TYPES.track ||
    entity.entityType === ENTITY_TYPES.course ||
    entity.entityType === ENTITY_TYPES.chapter
  )
}
