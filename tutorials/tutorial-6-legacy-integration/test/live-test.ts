import { testCourse, testStudent, testTrack } from './test-factories'
import { saveCourse } from '../src/domain/course'
import { getStudentById, saveStudent } from '../src/domain/student'
import { saveTrack } from '../src/domain/track'
import { publishSnsMessage } from '../src/clients/aws-clients'
import { delay } from './delay'
import { EXTERNAL_EVENT_TYPES } from '../src/types'

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

    await publishSnsMessage(EXTERNAL_EVENT_TYPES.course_completed, {
      studentId,
      courseId: courseId1
    })

    await publishSnsMessage(EXTERNAL_EVENT_TYPES.course_completed, {
      studentId,
      courseId: courseId2
    })

    await delay(5000)
    const result = await getStudentById(studentId)
    console.log(result)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('live test complete')
    process.exit(0)
  })
