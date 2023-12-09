import {
  ChatMessagesType,
  CurrentChatWithType,
  ServerMessageContent,
} from "./types";
import React, { Dispatch } from "react";
import {
  getChatMessages,
  getUserDetails,
  refreshAuserChat,
  resetUserUnreadMessages,
  sendMessage,
} from "../../utils/api";

import { ChatUsersType } from "./types";
import Cookies from "js-cookie";
import _ from "lodash";
import socket from "../../utils/sockets/socket";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useChatHandlers = (
  currentChatWith: CurrentChatWithType | undefined,
  userName: string | undefined,
  chatUsers: ChatUsersType[],
  onlineUsers: ChatUsersType[],
  chatMessages: ChatMessagesType[],
  setChatMessages: Dispatch<React.SetStateAction<ChatMessagesType[]>>,
  setCurrentChatWith: React.Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >,
  setChatUsers: Dispatch<React.SetStateAction<ChatUsersType[]>>,
  setOnlineusers: Dispatch<React.SetStateAction<ChatUsersType[]>>
) => {
  const navigate = useNavigate();

  const sendPrivateMessage = async (content: string) => {
    const user = Cookies.get("userName");
    await sendMessage(user, currentChatWith?.username, content);
    socket.emit("private message", {
      content: content,
      to: currentChatWith,
      fromUserName: user,
    });
    initilizeChats();
    const shappedOnlineUser = onlineUsers.map((onlineUser) => {
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
      currentChatWith?.username
    );
    const chats = chatMessgaes.data.messages.chats;
    !_.isEqual(chats, chatMessages) && setChatMessages(chats);
  }, [chatMessages, currentChatWith?.username, setChatMessages, userName]);

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

      setOnlineusers(
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

        setChatUsers(userDataShappedAsChatUsers);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [setChatUsers, setOnlineusers]
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
    setOnlineusers((prev) => {
      return [...prev, newUser];
    });

    // sets the online status of chat users if socket says new user connected
    setChatUsers((prev) => {
      let setUsersStatusToOnline = prev.map((chatUser) => {
        if (chatUser.user === user.username) {
          return { ...chatUser, status: "online" };
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
    setOnlineusers((prev) => {
      const updatedList = prev.filter(
        (disconnectedUser) => disconnectedUser.user !== user.username
      );
      return updatedList;
    });

    setChatUsers((prev) => {
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

      if (currentChatWith?.username === msgContent.from) {
        await resetUserUnreadMessages(user, msgContent.from);
      }

      const newMessages = await getChatMessages(
        user,
        currentChatWith?.username
      );

      await refreshAuserChat(msgContent.from, setChatUsers);

      setChatMessages(newMessages.data.messages.chats);

      const shappedOnlineUser = onlineUsers.map((onlineUser) => {
        return {
          userID: onlineUser.userId,
          username: onlineUser.user,
        };
      });
      handleChatUsers(shappedOnlineUser);
    },
    [
      currentChatWith?.username,
      handleChatUsers,
      onlineUsers,
      setChatMessages,
      setChatUsers,
    ]
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
