import {
  createUserChat,
  deleteUserChat,
  editUserChat,
  getUserChats,
} from "../controller/chatControllers";

import express from "express";

const chatRouter = express.Router();

chatRouter
  .route("/:id")
  .get(getUserChats)
  .post(createUserChat)
  .delete(deleteUserChat)
  .patch(editUserChat);

export default chatRouter;
