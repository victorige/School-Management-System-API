const request = require("supertest");
const appModule = require("../app");
const app = appModule.getApp();

describe("School Admin Account and Classroom Management", () => {
  let tokenSuperAdmin;
  let tokenSchoolAdmin;
  let schoolId;
  let classroomId;

  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
  const baseUrl = "/api/school"; // Base URL for school endpoints

  // Helper function to create a school
  const createSchool = async (schoolData) => {
    const res = await request(app)
      .post(`${baseUrl}/create`) // Use base URL here
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

  beforeAll(async () => {
    appModule.start();

    // Seed admin user (super admin)
    await request(app).get("/api/seed/admin");

    // Login as super admin
    const loginResponseSuperAdmin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    tokenSuperAdmin = loginResponseSuperAdmin.body?.data?.token;
    expect(tokenSuperAdmin).toBeDefined();

    // Create school under super admin
    const schoolData = {
      name: "Test School",
      address: "123 Test St",
      contactEmail: "contact@testschool.com",
      phone: "1234567890",
    };
    const school = await createSchool(schoolData);
    schoolId = school._id;

    // Create school admin user
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
  });

  /** Classroom CRUD Tests */
  describe("Classroom Management", () => {
    // **Create Classroom**
    describe("POST /create", () => {
      it("should create a classroom as a school admin", async () => {
        const res = await request(app)
          .post("/api/classroom/create")
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            name: "Math Classroom",
            capacity: 30,
            resources: ["Projector", "Whiteboard"],
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.classroom).toHaveProperty("_id");
        classroomId = res.body.data.classroom._id;
      });

      it("should not create a classroom with an existing name", async () => {
        const res = await request(app)
          .post("/api/classroom/create")
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            name: "Math Classroom", // Duplicate name
            capacity: 30,
            resources: ["Projector", "Whiteboard"],
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toContain(
          "Classroom with this name already exists in the specified school."
        );
      });
    });

    // **Get Classrooms**
    describe("GET /getAll and /get/:id", () => {
      it("should fetch all classrooms with pagination as school admin", async () => {
        const res = await request(app)
          .get("/api/classroom/getAll")
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.classrooms).toBeInstanceOf(Array);
        expect(res.body.data.pagination.totalRecords).toBeGreaterThan(0);
      });

      it("should fetch classroom by ID as school admin", async () => {
        const res = await request(app)
          .get(`/api/classroom/get/${classroomId}`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.classroom._id).toBe(classroomId);
        expect(res.body.data.classroom.name).toBe("Math Classroom");
      });
    });

    // **Update Classroom**
    describe("PUT /update/:id", () => {
      it("should update classroom as school admin", async () => {
        const res = await request(app)
          .put(`/api/classroom/update/${classroomId}`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({
            name: "Updated Math Classroom",
            capacity: 35,
            resources: ["Smartboard", "Whiteboard"],
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.classroom.name).toBe("Updated Math Classroom");
      });

      it("should return 404 when updating a non-existing classroom", async () => {
        const res = await request(app)
          .put("/api/classroom/update/660f0c4b9b8d1a0012345678")
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`)
          .send({ name: "Non-Existent Classroom" });

        expect(res.statusCode).toBe(404);
        expect(res.body.errors).toContain(
          "Classroom not found or does not belong to your school."
        );
      });
    });

    // **Delete Classroom**
    describe("DELETE /delete/:id", () => {
      it("should delete classroom as school admin", async () => {
        const res = await request(app)
          .delete(`/api/classroom/delete/${classroomId}`)
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Classroom deleted successfully.");
      });

      it("should return 404 when deleting a non-existing classroom", async () => {
        const res = await request(app)
          .delete("/api/classroom/delete/660f0c4b9b8d1a0012345678")
          .set("Authorization", `Bearer ${tokenSchoolAdmin}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.errors).toContain(
          "Classroom not found or does not belong to your school."
        );
      });
    });
  });
  afterAll(() => {
    appModule.stop();
  });
});
