const request = require("supertest");
const appModule = require("../app");
const app = appModule.getApp();

describe("Student Management", () => {
  let tokenSchoolAdmin;
  let schoolId;
  let classroomId;
  let studentId;
  let tokenSuperAdmin;

  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
  const baseUrl = "/api/student";

  // Helper function to create a school
  const createSchool = async (schoolData) => {
    const res = await request(app)
      .post("/api/school/create")
      .set("Authorization", `Bearer ${tokenSuperAdmin}`)
      .send(schoolData);
    expect(res.statusCode).toBe(201);
    return res.body.data?.school;
  };

  const createUser = async (token, userData) => {
    const res = await request(app)
      .post("/api/user/create")
      .set("Authorization", `Bearer ${token}`)
      .send(userData);
    expect(res.statusCode).toBe(201);
  };

  const createClassroom = async (data) => {
    const res = await request(app)
      .post("/api/classroom/create")
      .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
      .send(data);

    expect(res.statusCode).toBe(201);
    return res.body.data.classroom._id;
  };

  beforeAll(async () => {
    appModule.start();

    await request(app).get("/api/seed/admin");

    const loginResponseSuperAdmin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    tokenSuperAdmin = loginResponseSuperAdmin.body?.data?.token;

    // Create school
    const schoolData = {
      name: "Test School",
      address: "123 Test St",
      contactEmail: "contact@testschool.com",
      phone: "1234567890",
    };
    const school = await createSchool(schoolData);
    schoolId = school._id;

    // Create school admin
    const schoolAdminData = {
      firstName: "School",
      lastName: "Admin",
      email: "school.admin@example.com",
      password: "password123",
      role: "school_admin",
      schoolId,
    };

    await createUser(tokenSuperAdmin, schoolAdminData);

    // Login as school admin
    const loginResponseSchoolAdmin = await request(app)
      .post("/api/auth/login")
      .send({
        email: schoolAdminData.email,
        password: schoolAdminData.password,
      });

    tokenSchoolAdmin = loginResponseSchoolAdmin.body?.data?.token;
    expect(tokenSchoolAdmin).toBeDefined();

    classroomId = await createClassroom({
      name: "Math Classroom",
      capacity: 30,
      resources: ["Projector", "Whiteboard"],
    });
  });

  /** Student CRUD Tests */
  describe("Student CRUD Operations", () => {
    /** Create Student */
    describe("POST /create", () => {
      it("should create a student as school admin", async () => {
        const res = await request(app)
          .post(`${baseUrl}/create`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            classroomId,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            enrollmentDate: "2025-01-01",
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.student).toHaveProperty("_id");
        studentId = res.body.data.student._id;
      });

      it("should return error if student email already exists", async () => {
        const res = await request(app)
          .post(`${baseUrl}/create`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            classroomId,
            firstName: "Jane",
            lastName: "Doe",
            email: "johndoe@example.com", // Duplicate email
            enrollmentDate: "2025-01-01",
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toContain("Email already exists.");
      });
    });

    /** Get All Students with Pagination */
    describe("GET /getAll", () => {
      it("should fetch all students with pagination and filters", async () => {
        const res = await request(app)
          .get(`${baseUrl}/getAll`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .query({ page: 1, limit: 10 });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.students).toBeInstanceOf(Array);
        expect(res.body.data.pagination).toEqual(
          expect.objectContaining({
            totalRecords: expect.any(Number),
            totalPages: expect.any(Number),
          })
        );
      });
    });

    /** Get Student by ID */
    describe("GET /get/:id", () => {
      it("should fetch student by ID", async () => {
        const res = await request(app)
          .get(`${baseUrl}/get/${studentId}`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.student._id).toBe(studentId);
      });

      it("should return error for non-existent student", async () => {
        const res = await request(app)
          .get(`${baseUrl}/get/660f0c4b9b8d1a0012345678`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.errors).toContain(
          "Student not found or does not belong to your school."
        );
      });
    });

    /** Update Student */
    describe("PUT /update/:id", () => {
      it("should update student information", async () => {
        const res = await request(app)
          .put(`${baseUrl}/update/${studentId}`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            firstName: "John Updated",
            lastName: "Doe Updated",
            email: "johnupdated@example.com",
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.student.firstName).toBe("John Updated");
      });

      it("should return error for updating non-existent student", async () => {
        const res = await request(app)
          .put(`${baseUrl}/update/660f0c4b9b8d1a0012345678`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({ firstName: "Non Existent" });

        expect(res.statusCode).toBe(404);
        expect(res.body.errors).toContain(
          "Student not found or does not belong to your school."
        );
      });
    });

    /** Transfer Student */
    describe("PATCH /transfer", () => {
      it("should transfer student to another classroom", async () => {
        const newClassroomId = await createClassroom({
          name: "Math Classroom 2",
          capacity: 30,
          resources: ["Projector", "Whiteboard"],
        }); // Creating another classroom
        const res = await request(app)
          .patch(`${baseUrl}/transfer`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            studentId,
            classroomId: newClassroomId,
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.student.classroomId).toBe(newClassroomId);
      });

      it("should return error if student does not belong to the school", async () => {
        const res = await request(app)
          .patch(`${baseUrl}/transfer`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            studentId: "660f0c4b9b8d1a0012345678", // Invalid student
            classroomId: classroomId,
          });

        expect(res.statusCode).toBe(404);
        expect(res.body.errors).toContain(
          "Student not found or does not belong to your school."
        );
      });
    });

    /** Delete Student */
    describe("DELETE /delete/:id", () => {
      it("should delete student successfully", async () => {
        const res = await request(app)
          .delete(`${baseUrl}/delete/${studentId}`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Student deleted successfully.");
      });

      it("should return error for deleting non-existent student", async () => {
        const res = await request(app)
          .delete(`${baseUrl}/delete/660f0c4b9b8d1a0012345678`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.errors).toContain(
          "Student not found or does not belong to your school."
        );
      });
    });
  });

  afterAll(() => {
    appModule.stop();
  });
});
