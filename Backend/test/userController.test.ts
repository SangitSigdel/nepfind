import UserModel from "../src/model/chatModel";
import app from "../src/app";
import mongoose from "mongoose";
import request from "supertest";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("UserController", () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  const signupUser = async () => {
    const newUser = await request(app).post("/api/v1/user/signup").send({
      user_id: "user1",
      user_name: "user1",
    });
    return newUser;
  };

  test("GET /api/v1/user should return an empty array when no users are present", async () => {
    await signupUser();
    const response2 = await request(app).get("/api/v1/user/user1");
    expect(response2.status).toBe(200);

    const response = await request(app).get("/api/v1/user/user2");
    expect(response.status).toBe(404);
  });

  test("POST /api/v1/user/signup", async () => {
    const newUser = await signupUser();
    const sameNewUser = await signupUser();

    expect(newUser.status).toBe(200);
    expect(sameNewUser.status).toBe(400);
  });

  test("PATCH '/api/v1/user/status/:id to set the status of the user online", async () => {
    await signupUser();
    const setStatus = await request(app).patch("/api/v1/user/status/user1");
    expect(setStatus.body.online).toBe(true);
  });
});
