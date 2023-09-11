import { testChapter, testCourse, testTrack } from '../../test/testFactories'
import { getChapterById, getChaptersByCourseId, saveChapter } from './chapter'
import { getCourseById, saveCourse } from './course'
import { saveTrack } from './track'

const chapter1 = testChapter()
const chapter2 = testChapter()
const track = testTrack()
const course = testCourse()

let chapterId1: string
let chapterId2: string
let trackId: string
let courseId: string

describe('chapter', () => {
  beforeAll(async () => {
    trackId = await saveTrack(track.name)
    courseId = await saveCourse({ ...course, trackId })
    chapterId1 = await saveChapter({ ...chapter1, courseId })
    chapterId2 = await saveChapter({ ...chapter2, courseId })

    const courseId2 = await saveCourse({ ...course, trackId })
    await saveChapter({ ...chapter2, courseId: courseId2 })
  })

  it('should return a Chapter when a valid ID is provided', async () => {
    const result = await getChapterById(chapterId1)
    expect(result).toEqual({
      id: chapterId1,
      ...chapter1,
      courseId,
      trackId,
      entityType: 'chapter'
    })
  })

  it('should return null when an invalid ID is provided', async () => {
    const result = await getCourseById('invalid-id')
    expect(result).toBeNull()
  })

  it('should return an array of Chapters', async () => {
    const result = await getChaptersByCourseId(courseId)
    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        {
          id: chapterId1,
          ...chapter1,
          courseId,
          trackId,
          entityType: 'chapter'
        },
        {
          id: chapterId2,
          ...chapter2,
          courseId,
          trackId,
          entityType: 'chapter'
        }
      ])
    )
  })

  it('should save a Chapter and return its ID', async () => {
    const result = await saveChapter({
      name: 'New Chapter',
      courseId,
      xp: 50
    })

    expect(result).toBeDefined()
  })

  it('should throw an error when the course does not exist', async () => {
    const name: string = 'Chapter 2'
    const courseId: string = 'non-existent-course-id'
    const xp: number = 200

    await expect(saveChapter({ name, courseId, xp })).rejects.toThrow(
      'Course not found'
    )
  })
})
