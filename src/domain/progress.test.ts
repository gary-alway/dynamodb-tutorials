import {
  testTrack,
  testCourse,
  testStudent,
  testChapter
} from '../../test/testFactories'
import { saveChapter } from './chapter'
import { saveCourse } from './course'
import {
  chapterComplete,
  getChapterProgress,
  getCourseProgress,
  saveCourseProgress
} from './progress'
import { saveStudent } from './student'
import { saveTrack } from './track'

const student = testStudent()
const track = testTrack()
const course = testCourse()
const chapter = testChapter()

let studentId: string
let trackId: string
let courseId: string
let chapterId: string

describe('progress', () => {
  beforeAll(async () => {
    studentId = await saveStudent(student)
    trackId = await saveTrack(track)
    courseId = await saveCourse({ ...course, trackId })
    chapterId = await saveChapter({ ...chapter, courseId })
  })

  describe('course progress', () => {
    it('should return course progress when it exists', async () => {
      await saveCourseProgress({ studentId, courseId, percent: 50 })

      const result = await getCourseProgress({
        courseId,
        studentId
      })

      expect(result).not.toBeNull()
      expect(result?.percent).toEqual(50)
    })

    it('should return null when course progress does not exist', async () => {
      const result = await getCourseProgress({
        courseId: 'non-existent-course-id',
        studentId: 'non-existent-student-id'
      })

      expect(result).toBeNull()
    })

    it('should throw an error when the course does not exist', async () => {
      const savePromise = saveCourseProgress({
        courseId: 'non-existent-course-id',
        studentId,
        percent: 50
      })

      await expect(savePromise).rejects.toThrow('Course not found')
    })
  })

  describe('chapter progress', () => {
    it('should return chapter progress when it exists', async () => {
      await chapterComplete({ studentId, chapterId })

      const result = await getChapterProgress({
        chapterId,
        studentId
      })

      expect(result).not.toBeNull()
      expect(result?.percent).toEqual(100)
    })

    it('should return null when chapter progress does not exist', async () => {
      const result = await getChapterProgress({
        chapterId: 'non-existent-chapter-id',
        studentId: 'non-existent-student-id'
      })

      expect(result).toBeNull()
    })

    it('should throw an error when the chapter does not exist', async () => {
      const savePromise = chapterComplete({
        chapterId: 'non-existent-course-id',
        studentId
      })

      await expect(savePromise).rejects.toThrow('Chapter not found')
    })
  })
})
