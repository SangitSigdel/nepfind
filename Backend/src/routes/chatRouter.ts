import {
  createUserChat,
  deleteUserChat,
  editUserChat,
  getUserChats,
  resetUnreadMessages,
  setChatStatusSeen,
} from "../controller/chatControllers";

import express from "express";

const chatRouter = express.Router();

chatRouter.route("/chatstatus/:id").post(setChatStatusSeen);

chatRouter.route("/resetunread/:id").patch(resetUnreadMessages);

chatRouter
  .route("/:id")
  .get(getUserChats)
  .post(createUserChat)
  .delete(deleteUserChat)
  .patch(editUserChat);

export default chatRouter;
