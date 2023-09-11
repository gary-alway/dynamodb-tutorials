import { testTrack, testCourse, testStudent } from '../../test/testFactories'
import { saveCourse } from './course'
import { getCourseProgress, saveCourseProgress } from './progress'
import { saveStudent } from './student'
import { saveTrack } from './track'

const student = testStudent()
const track = testTrack()
const course = testCourse()

let studentId: string
let trackId: string
let courseId: string

describe('course progress', () => {
  beforeAll(async () => {
    studentId = await saveStudent(student)
    trackId = await saveTrack(track.name)
    courseId = await saveCourse({ ...course, trackId })
  })

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
