import { ChatMessagesType, CurrentChatWithType } from ".";
import React, { Dispatch } from "react";
import {
  getChatMessages,
  getUserDetails,
  refreshAuserChat,
  resetUserUnreadMessages,
  sendMessage,
} from "../../utils/api";

import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import _ from "lodash";
import socket from "../../utils/sockets/socket";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type ServerMessageContent = {
  content: string;
  from: string;
  to: {
    username: string;
    userID: string;
  };
  userName: string;
};

export const useChatHandlers = (
  currentChatWith: CurrentChatWithType | undefined,
  userName: string | undefined,
  chatUsers: ChatUsersType[],
  chatMessages: ChatMessagesType[],
  setChatMessages: Dispatch<React.SetStateAction<ChatMessagesType[]>>,
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
            userId: el.userID,
            unreadMsgs: unreadMessages,
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
      unreadMessage = connectedUser[0]?.unread;
      recentMessage =
        connectedUser[0]?.chats[connectedUser[0]?.chats.length - 1].message;
    }

    setChatUsers((prev) => {
      return [
        ...prev,
        {
          user: user.username,
          status: "online",
          userId: user.userID,
          unreadMsgs: unreadMessage,
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
  };

  const handlePrivateMessages = useCallback(
    async (msgContent: ServerMessageContent) => {
      const user = Cookies.get("userName");

      /* ma tei sang chat gareko the ra tesaiko msg aayo vane */

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
