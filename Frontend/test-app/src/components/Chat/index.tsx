import React, { useCallback, useState } from "react";
import { getChatMessages, sendMessage } from "../../utils/api";

import { Box } from "@mui/material";
import { ChatScreen } from "./ChatScreen";
import { ChatUsers } from "./ChatUsers";
import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import _ from "lodash";
import socket from "../../utils/sockets/socket";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export type ChatMessagesType = {
  chat_id: number;
  message: string;
  messageByUser: boolean;
  dateTime?: string;
  _id?: string;
};

type ServerMessageContent = {
  content: string;
  from: string;
  userName: string;
};

export type CurrentChatWithType = {
  username: string;
  userID: string;
};

export const Chat = () => {
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState<ChatMessagesType[]>([]);

  const [chatUsers, setChatUsers] = useState<ChatUsersType[]>([]);

  const [currentChatWith, setCurrentChatWith] = useState<CurrentChatWithType>();

  const userName = Cookies.get("userName");

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

  useEffect(() => {
    if (!userName) {
      navigate("/");
    } else {
      currentChatWith && initilizeChats();

      socket.connect();
      socket.auth = { userName };

      socket.on("users", handleChatUsers);
      socket.on("user connected", handleUserConnected);
      socket.on("user disconnected", handleUserDiconnected);
      socket.on("private message", handlePrivateMessages);
      socket.on("connect_error", handleConnectionError);
    }
    return () => {
      socket.off("connect_error");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [
    navigate,
    currentChatWith,
    chatMessages,
    userName,
    initilizeChats,
    handleConnectionError,
    handlePrivateMessages,
  ]);

  return (
    <>
      <Box
        component="div"
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          height: "100vh",
        }}
      >
        <ChatWrapper>
          <ChatUsers
            users={chatUsers}
            setCurrentChatWith={setCurrentChatWith}
            currentChatWith={currentChatWith}
          />
          <ChatScreen
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            chatMessagesWith={currentChatWith}
            sendPrivateMessage={sendPrivateMessage}
          />
        </ChatWrapper>
      </Box>
    </>
  );
};
