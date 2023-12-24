import { NextFunction, Request, Response } from "express";
import UserModel, { ChatMessage, IUser, UserChats } from "../model/chatModel";

/* TODO: have a checks input from user in the user body before doing any processing 
        and response user that the following field is missing
*/

export const getUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chatUserId } = req.query;

  try {
    const user = await UserModel.findOne({ user_id: req.params.id });
    if (user) {
      const messages = user.messages.filter(
        (message) => message.user_id === chatUserId
      )[0];

      res.status(200).send({
        status: "success",
        messages: messages || [],
      });
    } else {
      res.status(404).send({
        status: "failed",
        messages: [],
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

  const fromUser = await UserModel.findOne({ user_id: req.params.id });

  const toUser = await UserModel.findOne({ user_id: chatUserId });

  const chatData: ChatMessage = {
    chat_id: 0,
    message: chatMessage,
    messagebyuser: true,
    dateTime: new Date(),
    seen: false,
  };

  const setMessage = (user: IUser | null, isMessageFromUser: boolean) => {
    const set_user_id = isMessageFromUser ? toUser?.user_id : fromUser?.user_id;

    const chat = user?.messages.find(
      (message) => message.user_id === set_user_id
    );

    chatData.messagebyuser = isMessageFromUser;

    if (chat) {
      if (!isMessageFromUser) {
        const numOfUnreadMessages = chat.unread;
        chat.unread = numOfUnreadMessages + 1;
      }

      if (chat.chats.length > 0) {
        const chat_id = chat.chats[chat.chats.length - 1].chat_id + 1;
        chatData.chat_id = chat_id;
        chat.chats.push(chatData);
      } else {
        chat.chats.push(chatData);
      }
    } else {
      set_user_id &&
        user?.messages.push({
          user_id: set_user_id,
          chats: [chatData],
          unread: !isMessageFromUser ? 1 : 0,
        });
    }
  };

  if (!fromUser || !toUser) {
    res.status(400).send({
      message: "sorry no user found",
    });
  } else {
    await setMessage(fromUser, true);
    await setMessage(toUser, false);

    await fromUser.save();
    await toUser.save();

    res.status(200).send({
      status: "success",
      messages: fromUser.messages,
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

export const setChatStatusSeen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chat_user_id, chat_id } = req.body;
  try {
    const user = await UserModel.findOne({ user_id: req.params.id });

    if (user) {
      const messages: UserChats[] = user.messages.filter(
        (msg) => msg.user_id === chat_user_id
      );

      const chats = messages[0].chats.filter(
        (chat) => chat.chat_id === chat_id
      );

      chats[0].seen = true;

      await user.save();
      res.status(200).send({
        chat: chats[0],
      });
    } else {
      res.status(404).send({
        message: "sorry user not found",
      });
    }
  } catch (error) {
    res.status(404).send({
      error,
    });
  }
};

export const resetUnreadMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ user_id: req.params.id });

    const messagesToReset = user?.messages.filter(
      (msg) => msg.user_id === req.body.chatUserId
    );

    if (messagesToReset && messagesToReset.length > 0) {
      messagesToReset[0].unread = 0;
      res.status(200).send({
        status: "success",
        message: "Unread message reset successful",
      });

      user?.save();
    } else {
      res.status(200).send({
        status: "failed",
        message: "sorry failed",
      });
    }
  } catch (error) {
    res.status(400).send({
      error,
    });
    console.log(error);
  }
};
