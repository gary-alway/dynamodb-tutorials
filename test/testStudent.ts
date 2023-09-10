import { faker } from '@faker-js/faker'

export const testEmail = () => faker.internet.email().toLocaleLowerCase()

export const testStudent = (overrides: Partial<Student> = {}): Student => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: testEmail(),
  xp: 0,
  ...overrides
})
