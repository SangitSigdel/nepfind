import React, { useState } from "react";

import { Box } from "@mui/material";
import { ChatScreen } from "./ChatScreen";
import { ChatUsers } from "./ChatUsers";
import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import { MobileChatView } from "./MobileChatView";
import socket from "../../utils/socket";
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

  const [chatUsers, setChatUsers] = useState<ChatUsersType[]>([]);

  useEffect(() => {
    const userName = Cookies.get("userName");
    if (!userName) {
      navigate("/");
    } else {
      socket.connect();
      socket.auth = { userName };

      socket.on("users", (users) => {
        console.log("The user is: ", users);
        users.map((el: { userID: string; username: string }) => {
          setChatUsers((prev) => {
            return [...prev, { user: el.username, status: "online" }];
          });
        });
      });

      socket.on(
        "user connected",
        (user: { username: string; userID: string }) => {
          setChatUsers((prev) => {
            return [...prev, { user: user.username, status: "online" }];
          });
        }
      );

      socket.on(
        "user disconnected",
        (user: { username: string; userID: string }) => {
          setChatUsers((prev) => {
            return prev.filter((prevUser) => prevUser.user !== user.username);
          });
        }
      );

      socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          Cookies.remove("userName");
          navigate("/");
        }
      });
    }
    return () => {
      socket.off("connect_error");
      socket.off("users");
      socket.off("user connected");
    };
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
          <ChatUsers users={chatUsers} />
          <ChatScreen
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        </ChatWrapper>
      </Box>

      {/* <Box component="div" sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileChatView
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        /> */}
      {/* </Box> */}
    </>
  );
};
