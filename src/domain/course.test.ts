import { testCourse, testTrack } from '../../test/testFactories'
import { getCourseById, getCoursesByTrackId, saveCourse } from './course'
import { saveTrack } from './track'

const course1 = testCourse()
const course2 = testCourse()
const track = testTrack()

let courseId1: string
let courseId2: string
let trackId: string

describe('course', () => {
  beforeAll(async () => {
    trackId = await saveTrack(track)
    courseId1 = await saveCourse({ ...course1, trackId })
    courseId2 = await saveCourse({ ...course2, trackId })
  })

  it('should return a Course when a valid ID is provided', async () => {
    const result = await getCourseById(courseId1)
    expect(result).toEqual({
      id: courseId1,
      ...course1,
      trackId
    })
  })

  it('should return null when an invalid ID is provided', async () => {
    const result = await getCourseById('invalid-id')
    expect(result).toBeNull()
  })

  it('should return an array of Courses', async () => {
    const result = await getCoursesByTrackId(trackId)
    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        {
          id: courseId1,
          ...course1,
          trackId
        },
        {
          id: courseId2,
          ...course2,
          trackId
        }
      ])
    )
  })

  it('should save a Course and return its ID', async () => {
    const result = await saveCourse({
      name: 'New Course',
      trackId,
      xp: 50
    })

    expect(result).toBeDefined()
  })
})
