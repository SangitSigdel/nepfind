import { ChatMessagesType, CurrentChatWithType } from ".";
import React, { Dispatch } from "react";
import { getChatMessages, sendMessage } from "../../utils/api";

import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import _ from "lodash";
import socket from "../../utils/sockets/socket";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type ServerMessageContent = {
  content: string;
  from: string;
  userName: string;
};

export const useChatHandlers = (
  currentChatWith: CurrentChatWithType | undefined,
  userName: string | undefined,
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
      to: currentChatWith?.userID,
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
  }, [chatMessages, currentChatWith?.username, userName]);

  const handleChatUsers = (
    users: {
      userID: string;
      username: string;
    }[]
  ) => {
    const updatedUser = users.filter(
      (user: { userID: string }) => user.userID !== socket.id
    );

    updatedUser.map((el: { userID: string; username: string }) => {
      setChatUsers((prev) => {
        return [
          ...prev,
          { user: el.username, status: "online", userId: el.userID },
        ];
      });
    });
  };

  const handleUserConnected = (user: { username: string; userID: string }) => {
    setChatUsers((prev) => {
      return [
        ...prev,
        { user: user.username, status: "online", userId: user.userID },
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

      const newMessages = await getChatMessages(
        user,
        currentChatWith?.username
      );

      setChatMessages(newMessages.data.messages.chats);
    },
    [currentChatWith?.username]
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
