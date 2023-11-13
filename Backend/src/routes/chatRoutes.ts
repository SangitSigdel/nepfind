import express from "express";

const chatRouter = express.Router();

chatRouter.get("/", (req, res, next) => {
  return res.status(200).send({
    message: "This route gets all chats with pages per load",
  });
});

chatRouter.post("/:user_id", (req, res, next) => {
  res.status(200).send({
    message: "This route post new chats",
  });
  next();
});

chatRouter.delete("/:chat_id", (req, res, next) => {
  res.status(200).send({
    message: "This route deletes your chat",
  });
  next();
});

export default chatRouter;
