import React, { useState } from "react";
import styled, { useTheme } from "styled-components";

import { Box } from "@mui/material";
import { ChatScreen } from "./ChatScreen";
import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import { NewChatScreen } from "./ChatUsers";
import socket from "../../utils/sockets/socket";
import { useChatHandlers } from "./useChatHandlers";
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

export type CurrentChatWithType = {
  username: string;
  userID: string;
};

export const Chat = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const [chatMessages, setChatMessages] = useState<ChatMessagesType[]>([]);

  const [chatUsers, setChatUsers] = useState<ChatUsersType[]>([]);

  const [currentChatWith, setCurrentChatWith] = useState<CurrentChatWithType>();

  const userName = Cookies.get("userName");

  const {
    initilizeChats,
    sendPrivateMessage,
    handleChatUsers,
    handleUserConnected,
    handleUserDiconnected,
    handlePrivateMessages,
    handleConnectionError,
  } = useChatHandlers(
    currentChatWith,
    userName,
    chatMessages,
    setChatMessages,
    setChatUsers
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
    handleChatUsers,
    handleUserConnected,
    handleUserDiconnected,
    handlePrivateMessages,
    handleConnectionError,
  ]);

  return (
    <>
      <Box
        component="div"
        sx={{
          display: {
            background: theme.palette.primary.dark,
          },
          height: "100%",
        }}
      >
        <ChatWrapper>
          <Box
            style={{ background: theme.palette.primary.dark }}
            sx={{ borderRight: `.25px solid ${theme.palette.border.main}` }}
          >
            <NewChatScreen
              users={chatUsers}
              setCurrentChatWith={setCurrentChatWith}
              currentChatWith={currentChatWith}
            />
          </Box>
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
