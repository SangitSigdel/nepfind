import { ChatMessagesType, ChatUsersType, CurrentChatWithType } from "./types";
import React, { useState } from "react";

import { Box } from "@mui/material";
import { ChatScreen } from "./chatScreen/ChatScreen";
import { ChatUsers } from "./chatUser/ChatUsers";
import { ChatWrapper } from "./style";
import Cookies from "js-cookie";
import socket from "../../utils/sockets/socket";
import { useChatHandlers } from "./useChatHandlers";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

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
    chatUsers,
    chatMessages,
    setChatMessages,
    setCurrentChatWith,
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
    chatUsers,
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
            <ChatUsers
              chatMessages={chatMessages}
              users={chatUsers}
              setChatUsers={setChatUsers}
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
