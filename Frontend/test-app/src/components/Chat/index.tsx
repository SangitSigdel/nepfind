import React, { useState } from "react";

import { Box } from "@mui/material";
import { ChatScreen } from "./ChatScreen";
import { ChatUsers } from "./ChatUsers";
import Cookies from "js-cookie";
import { MobileChatView } from "./MobileChatView";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export type chatMessagesType = {
  message: string;
  sender: "user" | "other";
};

export const Chat = () => {
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState<chatMessagesType[]>([]);

  useEffect(() => {
    if (!Cookies.get("userName")) {
      navigate("/");
    }
  }, [navigate]);

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
          <ChatUsers />
          <ChatScreen
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        </ChatWrapper>
      </Box>

      <Box component="div" sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileChatView
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      </Box>
    </>
  );
};
