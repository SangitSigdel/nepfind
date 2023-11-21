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

describe("Checks for Chat Controllers", () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  const createNewUser = async () => {
    const newUser = await request(app).post("/api/v1/user/signup").send({
      user_id: "user123",
      user_name: "user123",
    });
    return newUser;
  };

  const createNewChat = async () => {
    const newChat = await request(app).post("/api/v1/chat/user123").send({
      chatUserId: "user2",
      chatMessage: "Hello from user123",
    });

    return newChat;
  };

  test("POST /api/v1/chat/:id should create a new chat", async () => {
    await createNewUser();
    const newChat = await createNewChat();

    expect(newChat.status).toBe(200);

    expect(newChat.body.status).toBe("message sent successfully");
  });

  test("GET /api/v1/chat/:userId should get the all chats", async () => {
    await createNewUser();
    await createNewChat();

    const chats = await request(app).get("/api/v1/chat/user123");
    expect(chats.status).toBe(200);
  });

  test("GET /api/v1/chat/:userId should get specific user chat", async () => {
    await createNewUser();
    await createNewChat();

    const chats = await request(app).get("/api/v1/chat/user123").send({
      chatUserId: "user2",
    });
    expect(chats.status).toBe(200);
  });

  test("PATCH /api/v1/chat/:userId should edit the requested message with matching id", async () => {
    await createNewUser();
    await createNewChat();
    const editedChat = await request(app).patch("/api/v1/chat/user123").send({
      chatUserId: "user2",
      chatId: 1,
      updatedMessage: "This is also an edit message",
    });
    expect(editedChat.status).toBe(200);
  });

  test("PATCH /api/v1/chat/:userId should edit the requested message with matching id", async () => {
    await createNewUser();
    await createNewChat();
    const deleteChat = await request(app).delete("/api/v1/chat/user123").send({
      chatUserId: "user2",
      chatId: 0,
    });
    expect(deleteChat.status).toBe(200);
  });
});
