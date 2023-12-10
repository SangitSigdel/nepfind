import { ChatContextType, ChatUsersType } from "./types";
import {
  getChatMessages,
  getUserDetails,
  refreshAuserChat,
  resetUserUnreadMessages,
  sendMessage,
} from "../../utils/api";

import Cookies from "js-cookie";
import React from "react";
import { ServerMessageContent } from "./types";
import _ from "lodash";
import socket from "../../utils/sockets/socket";

export const chatHandlers = (
  chatContext: ChatContextType,
  userName: string | undefined
) => {
  const sendPrivateMessage = async (content: string) => {
    const user = Cookies.get("userName");
    await sendMessage(user, chatContext.currentChatWith?.username, content);
    socket.emit("private message", {
      content: content,
      to: chatContext.currentChatWith,
      fromUserName: user,
    });
    initilizeChats();
    const shappedOnlineUser = chatContext.onlineUsers.map((onlineUser) => {
      return {
        userID: onlineUser.userId,
        username: onlineUser.user,
      };
    });
    handleChatUsers(shappedOnlineUser);
  };

  const initilizeChats = async () => {
    const chatMessgaes = await getChatMessages(
      userName,
      chatContext.currentChatWith?.username
    );
    const chats = chatMessgaes.data.messages.chats;
    !_.isEqual(chats, chatContext.chatMessages) &&
      chatContext.setChatMessages(chats);
  };

  const handleChatUsers = async (
    onlineUsers: {
      userID: string;
      username: string;
    }[]
  ) => {
    const loggedInUser = Cookies.get("userName") as string;
    // Set value for online users

    const shappedOnlineUsers: ChatUsersType[] = onlineUsers.map(
      (onlineUser) => {
        return {
          user: onlineUser.username,
          status: "online",
          userId: onlineUser.userID,
          unreadMsgs: 0,
          recentMsg: "",
        };
      }
    );

    chatContext.setOnlineUsers(
      shappedOnlineUsers.filter(
        (onlineUser) => onlineUser.user !== loggedInUser
      )
    );

    // Set value of all chats users

    // Filtering loggedin user from the online user list
    const filteredUser = onlineUsers.filter(
      (user: { userID: string }) => user.userID !== socket.id
    );
    onlineUsers = filteredUser;

    let userDataShappedAsChatUsers: ChatUsersType[] = [];

    try {
      const userData = await getUserDetails(loggedInUser);

      userData.data.data?.messages.map((msg, index) => {
        userDataShappedAsChatUsers.push({
          user: msg.user_id,
          status: "offline",
          userId: "",
          unreadMsgs: msg.unread,
          recentMsg: msg.chats[msg.chats.length - 1].message,
        });
      });

      userDataShappedAsChatUsers = userDataShappedAsChatUsers.map((user) => {
        const matchingOnlineUser = onlineUsers.find(
          (onlineUser) => onlineUser.username === user.user
        );
        if (matchingOnlineUser) {
          return {
            ...user,
            status: "online",
            userId: matchingOnlineUser.userID,
          };
        }
        return user;
      });

      chatContext.setChatUsers(userDataShappedAsChatUsers);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleUserConnected = async (user: {
    username: string;
    userID: string;
  }) => {
    const newUser: ChatUsersType = {
      user: user.username,
      status: "online",
      userId: user.userID,
      unreadMsgs: 0,
      recentMsg: "",
    };

    // Adds recently connected user to online list of user
    chatContext.setOnlineUsers((prev) => {
      return [...prev, newUser];
    });

    // sets the online status of chat users if socket says new user connected
    chatContext.setChatUsers((prev) => {
      let setUsersStatusToOnline = prev.map((chatUser) => {
        if (chatUser.user === user.username) {
          return { ...chatUser, status: "online", userId: user.userID };
        }
        return chatUser;
      });
      return setUsersStatusToOnline;
    });
  };

  const handleUserDiconnected = (user: {
    username: string;
    userID: string;
  }) => {
    chatContext.setOnlineUsers((prev) => {
      const updatedList = prev.filter(
        (disconnectedUser) => disconnectedUser.user !== user.username
      );
      return updatedList;
    });

    chatContext.setChatUsers((prev) => {
      let setUsersStatusToOffline = prev.map((chatUser) => {
        if (chatUser.user === user.username) {
          return { ...chatUser, status: "offline" };
        }
        return chatUser;
      });
      return setUsersStatusToOffline;
    });
  };

  const handlePrivateMessages = async (msgContent: ServerMessageContent) => {
    const user = Cookies.get("userName");

    if (chatContext.currentChatWith?.username === msgContent.from) {
      await resetUserUnreadMessages(user, msgContent.from);
    }

    const newMessages = await getChatMessages(
      user,
      chatContext.currentChatWith?.username
    );

    await refreshAuserChat(msgContent.from, chatContext.setChatUsers);

    chatContext.setChatMessages(newMessages.data.messages.chats);

    const shappedOnlineUser = chatContext.onlineUsers.map((onlineUser) => {
      return {
        userID: onlineUser.userId,
        username: onlineUser.user,
      };
    });
    handleChatUsers(shappedOnlineUser);
  };

  const handleConnectionError = (err: any) => {
    throw new Error(err);
  };

  return {
    initilizeChats,
    sendPrivateMessage,
    handleChatUsers,
    handleUserConnected,
    handleUserDiconnected,
    handlePrivateMessages,
    handleConnectionError,
  };
};
