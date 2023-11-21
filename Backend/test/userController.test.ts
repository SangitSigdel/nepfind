import UserModel from "../src/model/chatModel";
import app from "../src/app";
import mongoose from "mongoose";
import request from "supertest";

// Connect to the test database before running tests
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");
});

beforeEach(async () => {
  // Clear the User collection before each test
  await UserModel.deleteMany({});
});

// Disconnect from the test database after running tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("UserController", () => {
  test("GET /api/v1/user should return an empty array when no users are present", async () => {
    const newUser = await request(app).post("/api/v1/user/signup").send({
      user_id: "user1",
      user_name: "user1",
    });
    const response2 = await request(app).get("/api/v1/user/user1");
    expect(response2.status).toBe(200);

    const response = await request(app).get("/api/v1/user/user2");
    expect(response.status).toBe(404);
  });

  test("POST /api/v1/user/signup", async () => {
    const newUser = await request(app).post("/api/v1/user/signup").send({
      user_id: "sangit",
      user_name: "sangit",
    });
    expect(newUser.status).toBe(200);

    const newUser2 = await request(app).post("/api/v1/user/signup").send({
      user_id: "sangit",
      user_name: "sangit",
    });
    expect(newUser2.status).toBe(400);
  });
});
