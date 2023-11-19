import {
  createUser,
  getUser,
  updateUserStatus,
} from "../controller/userController";

import express from "express";

const userRouter = express.Router();

userRouter.post("/signup", createUser);

userRouter.get("/:id", getUser);

userRouter.patch("/status/:id", updateUserStatus);

export default userRouter;
