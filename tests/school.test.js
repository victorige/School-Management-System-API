const request = require("supertest");
const appModule = require("../app");
const app = appModule.getApp();

describe("School API", () => {
  let token;
  let schoolId;
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
  const baseUrl = "/api/school"; // Define base URL

  // Helper function for login
  const loginAsSuperAdmin = async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: adminEmail,
      password: adminPassword,
    });
    return loginResponse.body?.data?.token;
  };

  // Helper function to create a school
  const createSchool = async (schoolData) => {
    const res = await request(app)
      .post(`${baseUrl}/create`) // Use base URL here
      .set("Authorization", `Bearer ${token}`)
      .send(schoolData);
    return res.body.data?.school;
  };

  beforeAll(async () => {
    appModule.start();

    await request(app).get("/api/seed/admin"); // Seed admin user

    // Login as super admin
    token = await loginAsSuperAdmin();
    expect(token).toBeDefined();
  });

  /** POST /api/school/create */
  describe("POST /api/school/create", () => {
    it("should create a new school", async () => {
      const schoolData = {
        name: "Test School",
        address: "123 Test St",
        contactEmail: "contact@testschool.com",
        phone: "1234567890",
      };

      const school = await createSchool(schoolData);

      expect(school).toHaveProperty("_id");
      expect(school.name).toBe(schoolData.name);
      schoolId = school._id; // Save for later tests
    });

    it("should not create a school with an existing name", async () => {
      const schoolData = {
        name: "Test School",
        address: "456 Another St",
        contactEmail: "newcontact@testschool.com",
        phone: "987-654-3210",
      };

      const res = await request(app)
        .post(`${baseUrl}/create`) // Use base URL here
        .set("Authorization", `Bearer ${token}`)
        .send(schoolData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain(
        "School with this name already exists."
      );
      expect(res.body.message).toBe("Failed to create school");
    });

    it("should return an error if required fields are missing", async () => {
      const res = await request(app)
        .post(`${baseUrl}/create`) // Use base URL here
        .set("Authorization", `Bearer ${token}`)
        .send({}); // Missing required fields

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Validation failed");
      expect(res.body.errors).toContain(
        "name is required,address is required,contactEmail is required,phone is required"
      );
    });
  });

  /** GET /api/school/getAll */
  describe("GET /api/school/getAll", () => {
    it("should fetch all schools with pagination", async () => {
      const res = await request(app)
        .get(`${baseUrl}/getAll`) // Use base URL here
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.schools).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toEqual(
        expect.objectContaining({
          totalRecords: expect.any(Number),
          totalPages: expect.any(Number),
        })
      );
    });

    it("should fetch schools with filters applied", async () => {
      const res = await request(app)
        .get(`${baseUrl}/getAll?filters[name]=Test School`) // Use base URL here
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.schools).toBeInstanceOf(Array);
      expect(res.body.data.schools[0].name).toBe("Test School");
    });
  });

  /** GET /api/school/get/:id */
  describe("GET /api/school/get/:id", () => {
    it("should fetch a school by ID", async () => {
      const res = await request(app)
        .get(`${baseUrl}/get/${schoolId}`) // Use base URL here
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.school._id).toBe(schoolId);
      expect(res.body.data.school.name).toBe("Test School");
    });

    it("should return 404 if school does not exist", async () => {
      const res = await request(app)
        .get(`${baseUrl}/get/660f0c4b9b8d1a0012345678`) // Use base URL here
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.errors).toContain("School not found.");
      expect(res.body.message).toBe("Failed to retrieve school");
    });
  });

  /** PUT /api/school/update/:id */
  describe("PUT /api/school/update/:id", () => {
    it("should update a school", async () => {
      const updatedData = { name: "Updated School Name" };

      const res = await request(app)
        .put(`${baseUrl}/update/${schoolId}`) // Use base URL here
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.school.name).toBe(updatedData.name);
    });

    it("should return 404 when updating a non-existing school", async () => {
      const res = await request(app)
        .put(`${baseUrl}/update/660f0c4b9b8d1a0012345678`) // Use base URL here
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Non-Existent School" });

      expect(res.statusCode).toBe(404);
      expect(res.body.errors).toContain("School not found.");
      expect(res.body.message).toBe("Failed to update school");
    });
  });

  /** DELETE /api/school/delete/:id */
  describe("DELETE /api/school/delete/:id", () => {
    it("should delete a school", async () => {
      const res = await request(app)
        .delete(`${baseUrl}/delete/${schoolId}`) // Use base URL here
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("School deleted successfully.");
    });

    it("should return 404 when deleting a non-existing school", async () => {
      const res = await request(app)
        .delete(`${baseUrl}/delete/660f0c4b9b8d1a0012345678`) // Use base URL here
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.errors).toContain("School not found.");
      expect(res.body.message).toBe("Failed to delete school");
    });
  });

  /** UNAUTHORIZED ACCESS */
  describe("Unauthorized Access", () => {
    it("should return 401 if no authorization token is provided", async () => {
      const res = await request(app)
        .post(`${baseUrl}/create`) // Use base URL here
        .send({
          name: "Unauthorized School",
          address: "Secret St",
          contactEmail: "secret@school.com",
          phone: "000-000-0000",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });
  });

  afterAll(() => {
    appModule.stop();
  });
});
