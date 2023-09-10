import { testTrack } from '../../test/testTrack'
import { getTrackById, getTracks, saveTrack } from './track'

const track = testTrack()

let trackId: string

describe('track', () => {
  beforeAll(async () => {
    trackId = await saveTrack(track.name)
  })

  it('should return a Track when a valid ID is provided', async () => {
    const result = await getTrackById(trackId)
    expect(result).toEqual({ id: trackId, ...track, entityType: 'track' })
  })

  it('should return null when an invalid ID is provided', async () => {
    const result = await getTrackById('invalid-id')
    expect(result).toBeNull()
  })

  it('should return an array of Tracks', async () => {
    const result = await getTracks()
    expect(result).toHaveLength(1)
    expect(result).toEqual([{ id: trackId, ...track, entityType: 'track' }])
  })

  it('should save a Track and return its ID', async () => {
    const result = await saveTrack('new track')
    expect(result).toBeDefined()
  })
})