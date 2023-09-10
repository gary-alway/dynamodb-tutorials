import { faker } from '@faker-js/faker'
import { Student } from '../src/types'

export const testEmail = () => faker.internet.email().toLocaleLowerCase()

export const testStudent = (overrides: Partial<Student> = {}): Student => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: testEmail(),
  xp: 0,
  ...overrides
})
