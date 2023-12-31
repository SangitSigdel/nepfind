import React, { useContext } from "react";
import { handleSocketOff, socketHandler } from "../../utils/sockets/socket";

import { Box } from "@mui/material";
import ChatContext from "./context/ChatContext";
import { ChatScreen } from "./chatScreen/ChatScreen";
import { ChatUsers } from "./chatUser/ChatUsers";
import { ChatWrapper } from "./style";
import Cookies from "js-cookie";
import { chatHandlers } from "./chatHandlers";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";

export const Chat = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const chatContext = useContext(ChatContext);

  const userName = Cookies.get("userName");

  const { initilizeChats } = chatHandlers(chatContext);

  useEffect(() => {
    if (!userName) {
      navigate("/");
    } else {
      chatContext.currentChatWith && initilizeChats();
      socketHandler(chatContext);
    }
    return () => {
      handleSocketOff();
    };
  }, [navigate, userName, initilizeChats, chatContext]);

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
          <ChatUsers />
          <ChatScreen />
        </ChatWrapper>
      </Box>
    </>
  );
};
