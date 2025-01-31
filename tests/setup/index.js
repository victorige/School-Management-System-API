const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
  //   jest.mock("ion-cortex");

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Only connect if mongoose is not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(`${uri}`);
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean the database before each test
  //await mongoose.connection.db.dropDatabase();
});
