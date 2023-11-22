import { NextFunction, Request, Response } from "express";
import UserModel, { ChatMessage, IUser } from "../model/chatModel";

export const getUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chatUserId } = req.body;

  try {
    const user = await UserModel.findOne({ user_id: req.params.id });
    if (user) {
      const messages = user.messages.filter(
        (message) => message.user_id === chatUserId
      )[0].chats;

      res.status(200).send({
        status: "success",
        messages,
      });
    }
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};

export const createUserChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    chatUserId,
    chatMessage,
  }: { chatUserId: string; chatMessage: string } = req.body;

  const user = await UserModel.findOne({ user_id: req.params.id });

  const toUser = await UserModel.findOne({ user_id: chatUserId });

  console.log(toUser);

  const chatData: ChatMessage = {
    chat_id: 0,
    message: chatMessage,
    messageByUser: true,
    dateTime: new Date(),
  };

  const setMessage = (user: IUser | null, messageByUser: boolean) => {
    const chat = user?.messages.find(
      (message) => message.user_id === chatUserId
    );

    chatData.messageByUser = messageByUser;
    if (chat) {
      if (chat.chats.length > 0) {
        const chat_id = chat.chats[chat.chats.length - 1].chat_id + 1;
        chatData.chat_id = chat_id;
        chat.chats.push(chatData);
      } else {
        chat.chats.push(chatData);
      }
    } else {
      user?.messages.push({
        user_id: chatUserId,
        chats: [chatData],
      });
    }
  };

  if (!user || !toUser) {
    res.status(400).send({
      message: "sorry no user found",
    });
  } else {
    await setMessage(user, true);
    await setMessage(toUser, false);

    await user.save();
    await toUser.save();

    res.status(200).send({
      status: "message sent successfully",
      message: user.messages,
    });
  }
};

export const deleteUserChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chatUserId, chatId }: { chatUserId: string; chatId: number } =
    req.body;

  try {
    const user = await UserModel.findOne({ user_id: req.params.id });

    const userChats = user?.messages.find(
      (message) => message.user_id === chatUserId
    );

    const userChat = userChats?.chats.find((chat) => chat.chat_id === chatId);

    if (!userChat) {
      res.status(400).send({
        message: "sorry no chat found",
      });
    } else {
      user?.messages
        .filter((message) => message.user_id === chatUserId)
        .forEach((message) => {
          message.chats = message.chats.filter(
            (chat) => chat.chat_id !== chatId
          );
        });

      await user?.save();

      res.status(200).send({
        message: "selected chat deleted successfully",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};

export const editUserChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    chatUserId,
    chatId,
    updatedMessage,
  }: { chatUserId: string; chatId: number; updatedMessage: string } = req.body;

  const user = await UserModel.findOne({ user_id: req.params.id });

  if (!user) {
    res.status(404).send({
      message: "sorry no user found",
    });
  } else {
    user.messages
      .filter((message) => message.user_id === chatUserId)
      .forEach((message) => {
        message.chats.forEach((chat) => {
          if (chat.chat_id === chatId) {
            chat.message = updatedMessage;
          }
        });
      });

    await user.save();

    res.status(200).send({
      status: "selected message updated successfully",
      message: user,
    });
  }
};
