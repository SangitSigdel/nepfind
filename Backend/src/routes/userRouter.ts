import {
  createUser,
  createUserChat,
  deleteUserChat,
  editUserChat,
  getUser,
  getUserChats,
} from "../controller/userController";

import express from "express";

const userRouter = express.Router();

userRouter.post("/signup", createUser);

userRouter.get("/:id", getUser);

userRouter
  .route("/chat/:id")
  .get(getUserChats)
  .post(createUserChat)
  .delete(deleteUserChat)
  .patch(editUserChat);

export default userRouter;
