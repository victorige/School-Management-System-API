const request = require("supertest");
const appModule = require("../app");
const app = appModule.getApp();

describe("User API", () => {
  let token;
  const baseUrl = "/api/user";

  // Helper functions for reusability
  const authenticateAdmin = async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
    });
    return loginResponse.body?.data?.token;
  };

  const createUser = async (token, userData) => {
    return await request(app)
      .post(`${baseUrl}/create`)
      .set("Authorization", `Bearer ${token}`)
      .send(userData);
  };

  beforeAll(async () => {
    appModule.start();

    // Seed the admin user first
    await request(app).get("/api/seed/admin");

    token = await authenticateAdmin();

    expect(token).toBeDefined();

    // Seed multiple admins for testing purposes
    const adminPromises = [];
    for (let i = 1; i <= 10; i++) {
      adminPromises.push(
        createUser(token, {
          firstName: `User${i}`,
          lastName: "Test",
          email: `user${i}@example.com`,
          password: "password123",
          role: "super_admin",
        })
      );
    }
    await Promise.all(adminPromises);
  });

  describe("POST /create", () => {
    it("should create a super admin", async () => {
      const res = await createUser(token, {
        firstName: "John",
        lastName: "Doe",
        email: "JohnDoe@example.com",
        password: "password123",
        role: "super_admin",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.user).toHaveProperty("_id");
      expect(res.body.data.user.firstName).toBe("John");
    });

    it("should return validation error if required fields are missing", async () => {
      const res = await createUser(token, {
        firstName: "John", // Missing fields
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Validation failed");
    });

    it("should return error if email already exists", async () => {
      const email = "existinguser@example.com";
      await createUser(token, {
        firstName: "Jane",
        lastName: "Doe",
        email,
        password: "password123",
        role: "super_admin",
      });

      const res = await createUser(token, {
        firstName: "John",
        lastName: "Doe",
        email, // Duplicate email
        password: "password123",
        role: "super_admin",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Failed to create user");
      expect(res.body.errors).toContain("Email already in use.");
    });

    it("should return error if schoolId is missing for school_admin role", async () => {
      const res = await createUser(token, {
        firstName: "School",
        lastName: "Admin",
        email: "school.admin@example.com",
        password: "password123",
        role: "school_admin",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Failed to create user");
      expect(res.body.errors).toContain(
        "schoolId is required for school_admin role."
      );
    });

    it("should return error if schoolId is invalid", async () => {
      const res = await createUser(token, {
        firstName: "Invalid",
        lastName: "SchoolAdmin",
        email: "invalidschooladmin@example.com",
        password: "password123",
        role: "school_admin",
        schoolId: "679b3c769775897540ffc2cb", // Invalid schoolId
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Failed to create user");
      expect(res.body.errors).toContain("The specified school does not exist.");
    });
  });

  describe("GET /getAll", () => {
    it("should fetch all users", async () => {
      const res = await request(app)
        .get(`${baseUrl}/getAll`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.users)).toBeTruthy();
    });

    it("should fetch users with pagination", async () => {
      const res = await request(app)
        .get(`${baseUrl}/getAll`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toEqual(
        expect.objectContaining({
          totalRecords: expect.any(Number),
          totalPages: expect.any(Number),
          nextPage: expect.any(Number),
          prevPage: null,
        })
      );
    });

    it("should fetch users filtered by firstName", async () => {
      const res = await request(app)
        .get(`${baseUrl}/getAll?filters[firstName]=Admin`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.users)).toBeTruthy();
      if (res.body.data.users.length > 0) {
        expect(res.body.data.users[0].firstName).toBe("Admin");
      }
    });

    it("should fetch users sorted by createdAt in descending order", async () => {
      const res = await request(app)
        .get(`${baseUrl}/getAll?sortBy=createdAt&sortOrder=desc`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.users)).toBeTruthy();

      if (res.body.data.users.length >= 2) {
        const createdAtList = res.body.data.users.map(
          (user) => new Date(user.createdAt)
        );
        expect(createdAtList).toEqual([...createdAtList].sort((a, b) => b - a));
      }
    });
  });

  describe("Unauthorized requests", () => {
    it("should return error if no authorization token is provided", async () => {
      const res = await request(app).post(`${baseUrl}/create`).send({
        firstName: "Unauthorized",
        lastName: "User",
        email: "unauthorizeduser@example.com",
        password: "password123",
        role: "user",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Unauthorized");
      expect(res.body.errors).toContain("No token provided");
    });
  });
  afterAll(() => {
    appModule.stop();
  });
});
