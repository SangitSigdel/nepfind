import {
  createUserChat,
  deleteUserChat,
  editUserChat,
  getUserChats,
  setChatStatusSeen,
} from "../controller/chatControllers";

import express from "express";

const chatRouter = express.Router();

chatRouter
  .route("/:id")
  .get(getUserChats)
  .post(createUserChat)
  .delete(deleteUserChat)
  .patch(editUserChat);

chatRouter.route("/chatstatus/:id").post(setChatStatusSeen);

export default chatRouter;
