import {
  ChatMessagesType,
  CurrentChatWithType,
  ServerMessageContent,
} from "./types";
import React, { Dispatch, SetStateAction } from "react";
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
  chatMessages: ChatMessagesType[],
  setChatMessages: Dispatch<SetStateAction<ChatMessagesType[]>>,
  setCurrentChatWith: Dispatch<SetStateAction<CurrentChatWithType | undefined>>,
  setChatUsers: Dispatch<React.SetStateAction<ChatUsersType[]>>
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
  };

  const initilizeChats = useCallback(async () => {
    const chatMessgaes = await getChatMessages(
      userName,
      currentChatWith?.username
    );
    const chats = chatMessgaes.data.messages.chats;
    !_.isEqual(chats, chatMessages) && setChatMessages(chats);
  }, [chatMessages, currentChatWith?.username, setChatMessages, userName]);

  const handleChatUsers = async (
    users: {
      userID: string;
      username: string;
    }[]
  ) => {
    const updatedUser = users.filter(
      (user: { userID: string }) => user.userID !== socket.id
    );
    const loggedInUser = Cookies.get("userName") as string;

    const userData = await getUserDetails(loggedInUser);

    updatedUser.map(async (el: { userID: string; username: string }) => {
      let unreadMessages = 0;
      let userChatData;
      let recentMessage = "";
      if (userData) {
        userChatData = userData.data.data?.messages.filter(
          (msg) => msg.user_id === el.username
        )[0];

        unreadMessages = userChatData?.unread;
        recentMessage =
          userChatData?.chats[userChatData.chats.length - 1].message;
      }
      setChatUsers((prev) => {
        return [
          ...prev,
          {
            user: el.username,
            status: "online",
            socketId: el.userID,
            noOfUnreadMsgs: unreadMessages,
            recentMsg: recentMessage,
          },
        ];
      });
    });
  };

  const handleUserConnected = async (user: {
    username: string;
    userID: string;
  }) => {
    const userData = await getUserDetails(userName as string);

    const connectedUser = userData.data.data.messages.filter(
      (msg) => msg.user_id === user.username
    );
    let unreadMessage = 0;
    let recentMessage = "";
    if (connectedUser) {
      const [connectedUserData] = connectedUser;
      unreadMessage = connectedUserData.unread;
      recentMessage =
        connectedUserData.chats[connectedUserData?.chats.length - 1].message;
    }

    setChatUsers((prev) => {
      return [
        ...prev,
        {
          user: user.username,
          status: "online",
          socketId: user.userID,
          noOfUnreadMsgs: unreadMessage,
          recentMsg: recentMessage,
        },
      ];
    });
  };

  const handleUserDiconnected = (user: {
    username: string;
    userID: string;
  }) => {
    setChatUsers((prev) => {
      return prev.filter((prevUser) => prevUser.user !== user.username);
    });
    chatUsers.length <= 1 && setCurrentChatWith(undefined);
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
    },
    [currentChatWith, setChatMessages, setChatUsers]
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
