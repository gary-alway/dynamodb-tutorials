import { Handler, SQSEvent, SQSRecord } from 'aws-lambda'
import { EXTERNAL_EVENT_TYPES } from '../types'
import { chapterComplete, saveCourseProgress } from '../domain/progress'

const processMessage = async (record: SQSRecord) => {
  const {
    Message: { studentId, chapterId, courseId },
    EventType
  } = JSON.parse(record.body)

  console.log(`Processing event: ${EventType}`)

  switch (EventType) {
    case EXTERNAL_EVENT_TYPES.course_completed:
      await saveCourseProgress({ studentId, courseId, percent: 100 })
      break
    case EXTERNAL_EVENT_TYPES.chapter_completed:
      await chapterComplete({ studentId, chapterId })
      break
    default:
      console.log(`Unknown event type: ${EventType}`)
  }
}

export const handler: Handler = async (event: SQSEvent) => {
  await Promise.all(event.Records.map(processMessage))
}
