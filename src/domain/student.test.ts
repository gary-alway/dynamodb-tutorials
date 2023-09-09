import {
  deleteStudent,
  getStudentByEmail,
  getStudentById,
  saveStudent,
  updateStudent,
  updateStudentXp,
} from "./student";
import { faker } from "@faker-js/faker";

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email().toLocaleLowerCase();

let studentId: string;

describe("Student", () => {
  beforeAll(async () => {
    studentId = await saveStudent({
      firstName,
      lastName,
      email,
    });
  });

  it("should get a student by id", async () => {
    const student = await getStudentById(studentId);

    expect(student).toEqual({
      entityType: "student",
      xp: 0,
      id: studentId,
      firstName,
      lastName,
      email,
    });
  });

  it("should return null when getting a student by non-existent id", async () => {
    const student = await getStudentById("non-existent-id");
    expect(student).toBeNull();
  });

  it("should get a student by email", async () => {
    const student = await getStudentByEmail(email);

    expect(student).toEqual({
      entityType: "student",
      xp: 0,
      id: studentId,
      firstName,
      lastName,
      email,
    });
  });

  it("should return null when getting a student by non-existent email", async () => {
    const student = await getStudentByEmail("non-existent-email");
    expect(student).toBeUndefined();
  });

  it("should save a student", async () => {
    const id = await saveStudent({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLocaleLowerCase(),
    });

    expect(id).toBeDefined();
  });

  it("should update student XP", async () => {
    await updateStudentXp({ id: studentId, xp: 10 });
    const student = await getStudentById(studentId);
    expect(student?.xp).toEqual(10);
  });

  it("should delete a student", async () => {
    const id = await saveStudent({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLocaleLowerCase(),
    });

    expect(id).toBeDefined();

    await deleteStudent(id);
    const student = await getStudentById(id);

    expect(student).toBeNull();
  });

  it("should update a students first name", async () => {
    const studentToUpdate = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLocaleLowerCase(),
    };

    const id = await saveStudent(studentToUpdate);

    await updateStudent({ id, firstName: "new first name" });
    const student = await getStudentById(id);

    expect(student).toEqual({
      entityType: "student",
      xp: 0,
      id,
      firstName: "new first name",
      lastName: studentToUpdate.lastName,
      email: studentToUpdate.email,
    });
  });

  it("should update a students last name", async () => {
    const studentToUpdate = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLocaleLowerCase(),
    };

    const id = await saveStudent(studentToUpdate);

    await updateStudent({ id, lastName: "new last name" });
    const student = await getStudentById(id);

    expect(student).toEqual({
      entityType: "student",
      xp: 0,
      id,
      firstName: studentToUpdate.firstName,
      lastName: "new last name",
      email: studentToUpdate.email,
    });
  });

  it("should update a students email", async () => {
    const studentToUpdate = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLocaleLowerCase(),
    };

    const id = await saveStudent(studentToUpdate);

    const newEmail = faker.internet.email().toLocaleLowerCase();
    await updateStudent({ id, email: newEmail });
    const student = await getStudentById(id);

    expect(student).toEqual({
      entityType: "student",
      xp: 0,
      id,
      firstName: studentToUpdate.firstName,
      lastName: studentToUpdate.lastName,
      email: newEmail,
    });
  });
});
