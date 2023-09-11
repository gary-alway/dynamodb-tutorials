import { faker } from '@faker-js/faker'
import { Course, Track, Student, Chapter } from '../src/types'

export const testChapter = (overrides: Partial<Chapter> = {}): Chapter => ({
  name: faker.company.buzzPhrase(),
  xp: faker.number.int(),
  courseId: faker.string.uuid(),
  trackId: faker.string.uuid(),
  ...overrides
})

export const testCourse = (overrides: Partial<Course> = {}): Course => ({
  name: faker.company.buzzPhrase(),
  xp: faker.number.int(),
  trackId: faker.string.uuid(),
  ...overrides
})

export const testEmail = () => faker.internet.email().toLocaleLowerCase()

export const testStudent = (overrides: Partial<Student> = {}): Student => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: testEmail(),
  xp: 0,
  ...overrides
})

export const testTrack = (overrides: Partial<Track> = {}): Track => ({
  name: faker.company.buzzAdjective(),
  xp: faker.number.int(),
  ...overrides
})
