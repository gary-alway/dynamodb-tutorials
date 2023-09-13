import { testEmail, testStudent } from '../../test/testFactories'
import { ENTITY_TYPES } from '../types'
import {
  deleteStudent,
  getStudentByEmail,
  getStudentById,
  saveStudent,
  updateStudent,
  updateStudentXp
} from './student'

const student = testStudent()

let studentId: string

describe('Student', () => {
  beforeAll(async () => {
    studentId = await saveStudent(student)
  })

  it('should get a student by id', async () => {
    const student = await getStudentById(studentId)

    expect(student).toEqual({
      xp: 0,
      id: studentId,
      ...student
    })
  })

  it('should return null when getting a student by non-existent id', async () => {
    const student = await getStudentById('non-existent-id')
    expect(student).toBeNull()
  })

  it('should get a student by email', async () => {
    const result = await getStudentByEmail(student.email)

    expect(result).toEqual({
      id: studentId,
      ...student
    })
  })

  it('should return null when getting a student by non-existent email', async () => {
    const student = await getStudentByEmail('non-existent-email')
    expect(student).toBeNull()
  })

  it('should save a student', async () => {
    const id = await saveStudent(testStudent())

    expect(id).toBeDefined()
  })

  it('should update student XP', async () => {
    await updateStudentXp({ id: studentId, xp: 10 })
    const student = await getStudentById(studentId)
    expect(student?.xp).toEqual(10)
  })

  it('should delete a student', async () => {
    const id = await saveStudent(testStudent())

    expect(id).toBeDefined()

    await deleteStudent(id)
    const student = await getStudentById(id)

    expect(student).toBeNull()
  })

  it('should update a students first name', async () => {
    const studentToUpdate = testStudent()

    const id = await saveStudent(studentToUpdate)

    await updateStudent({ id, firstName: 'new first name' })
    const student = await getStudentById(id)

    expect(student).toEqual({
      entityType: ENTITY_TYPES.student,
      xp: 0,
      id,
      firstName: 'new first name',
      lastName: studentToUpdate.lastName,
      email: studentToUpdate.email
    })
  })

  it('should update a students last name', async () => {
    const studentToUpdate = testStudent()

    const id = await saveStudent(studentToUpdate)

    await updateStudent({ id, lastName: 'new last name' })
    const student = await getStudentById(id)

    expect(student).toEqual({
      entityType: ENTITY_TYPES.student,
      xp: 0,
      id,
      firstName: studentToUpdate.firstName,
      lastName: 'new last name',
      email: studentToUpdate.email
    })
  })

  it('should update a students email', async () => {
    const studentToUpdate = testStudent()

    const id = await saveStudent(studentToUpdate)

    const newEmail = testEmail()
    await updateStudent({ id, email: newEmail })
    const student = await getStudentById(id)

    expect(student).toEqual({
      entityType: ENTITY_TYPES.student,
      xp: 0,
      id,
      firstName: studentToUpdate.firstName,
      lastName: studentToUpdate.lastName,
      email: newEmail
    })
  })
})
