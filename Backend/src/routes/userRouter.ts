import {
  createUser,
  createUserChat,
  deleteUserChat,
  editUserChat,
  getUser,
  getUserChats,
  updateUserStatus,
} from "../controller/userController";

import express from "express";

const userRouter = express.Router();

userRouter.post("/signup", createUser);

userRouter.get("/:id", getUser);

userRouter.patch("/status/:id", updateUserStatus);

userRouter
  .route("/chat/:id")
  .get(getUserChats)
  .post(createUserChat)
  .delete(deleteUserChat)
  .patch(editUserChat);

export default userRouter;
