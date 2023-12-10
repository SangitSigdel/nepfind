import React, { useContext } from "react";

import { Box } from "@mui/material";
import ChatContext from "./context/ChatContext";
import { ChatScreen } from "./chatScreen/ChatScreen";
import { ChatWrapper } from "./style";
import Cookies from "js-cookie";
import { NewChatScreen } from "./chatUser/ChatUsers";
import socket from "../../utils/sockets/socket";
import { useChatHandlers } from "./useChatHandlers";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

export const Chat = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const chatContext = useContext(ChatContext);

  const userName = Cookies.get("userName");

  const {
    initilizeChats,
    sendPrivateMessage,
    handleChatUsers,
    handleUserConnected,
    handleUserDiconnected,
    handlePrivateMessages,
    handleConnectionError,
  } = useChatHandlers(chatContext, userName);

  useEffect(() => {
    if (!userName) {
      navigate("/");
    } else {
      chatContext.currentChatWith && initilizeChats();

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
    userName,
    initilizeChats,
    handleChatUsers,
    handleUserConnected,
    handleUserDiconnected,
    handlePrivateMessages,
    handleConnectionError,
    chatContext.currentChatWith,
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
              chatMessages={chatContext.chatMessages}
              users={chatContext.chatUsers}
              onlineUsers={chatContext.onlineUsers}
              setChatUsers={chatContext.setChatUsers}
              setCurrentChatWith={chatContext.setCurrentChatWith}
              currentChatWith={chatContext.currentChatWith}
            />
          </Box>
          <ChatScreen
            chatMessages={chatContext.chatMessages}
            setChatMessages={chatContext.setChatMessages}
            chatMessagesWith={chatContext.currentChatWith}
            sendPrivateMessage={sendPrivateMessage}
          />
        </ChatWrapper>
      </Box>
    </>
  );
};
