import { getStudentById, saveStudent, updateStudentXp } from './domain/student'

Promise.resolve()
  .then(async () => {
    const id = await saveStudent({
      firstName: 'Gary',
      lastName: 'Alway',
      email: 'gary.alway@gmail.com'
    })

    const student = await getStudentById(id)

    console.log(student)

    await updateStudentXp({ id, xp: 100 })

    const updatedStudent = await getStudentById(id)

    console.log(updatedStudent)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('done')
    process.exit(0)
  })
