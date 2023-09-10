import { faker } from '@faker-js/faker'
import { Track } from '../src/types'

export const testTrack = (overrides: Partial<Track> = {}): Track => ({
  name: faker.company.buzzAdjective(),
  ...overrides
})
