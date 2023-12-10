import React, { Dispatch } from "react";
import {
  getChatMessages,
  getUserDetails,
  refreshAuserChat,
  resetUserUnreadMessages,
  sendMessage,
} from "../../utils/api";

import { ChatContextType } from "./context/ChatContext";
import { ChatUsersType } from "./types";
import Cookies from "js-cookie";
import { ServerMessageContent } from "./types";
import _ from "lodash";
import socket from "../../utils/sockets/socket";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useChatHandlers = (
  chatContext: ChatContextType,
  userName: string | undefined
) => {
  const navigate = useNavigate();

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

  const initilizeChats = useCallback(async () => {
    const chatMessgaes = await getChatMessages(
      userName,
      chatContext.currentChatWith?.username
    );
    const chats = chatMessgaes.data.messages.chats;
    !_.isEqual(chats, chatContext.chatMessages) &&
      chatContext.setChatMessages(chats);
  }, [chatContext, userName]);

  const handleChatUsers = useCallback(
    async (
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
    },
    [chatContext]
  );

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

  const handlePrivateMessages = useCallback(
    async (msgContent: ServerMessageContent) => {
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
    },
    [chatContext, handleChatUsers]
  );

  const handleConnectionError = useCallback(
    (err: any) => {
      if (err.message === "invalid username") {
        Cookies.remove("userName");
        navigate("/");
      }
    },
    [navigate]
  );

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
