import { testCourse, testStudent, testTrack } from '../test/testFactories'
import { saveCourse } from './domain/course'
import { saveCourseProgress } from './domain/progress'
import { getStudentById, saveStudent } from './domain/student'
import { saveTrack } from './domain/track'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
Promise.resolve()
  .then(async () => {
    const student = testStudent()
    const studentId = await saveStudent(student)
    const before = await getStudentById(studentId)
    console.log(before)

    const track = testTrack()
    const trackId = await saveTrack(track)

    const course1 = testCourse({ xp: 2500 })
    const courseId1 = await saveCourse({ ...course1, trackId })
    const course2 = testCourse({ xp: 100 })
    const courseId2 = await saveCourse({ ...course2, trackId })

    await saveCourseProgress({ studentId, courseId: courseId1, percent: 100 })
    await saveCourseProgress({ studentId, courseId: courseId2, percent: 100 })

    await delay(2000)
    const result = await getStudentById(studentId)
    console.log(result)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('done')
    process.exit(0)
  })
