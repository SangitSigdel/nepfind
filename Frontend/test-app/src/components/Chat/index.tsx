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

export type ChatMessagesType = {
  message: string;
  sender: string;
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

  const sendPrivateMessage = (content: string) => {
    socket.emit("private message", {
      content: content,
      to: currentChatWith?.userID,
    });
  };

  useEffect(() => {
    const userName = Cookies.get("userName");
    if (!userName) {
      navigate("/");
    } else {
      socket.connect();
      socket.auth = { userName };

      socket.on("users", (users) => {
        users.map((el: { userID: string; username: string }) => {
          setChatUsers((prev) => {
            return [
              ...prev,
              { user: el.username, status: "online", userId: el.userID },
            ];
          });
        });
      });

      socket.on(
        "user connected",
        (user: { username: string; userID: string }) => {
          setChatUsers((prev) => {
            return [
              ...prev,
              { user: user.username, status: "online", userId: user.userID },
            ];
          });
        }
      );

      socket.on(
        "user disconnected",
        async (user: { username: string; userID: string }) => {
          setChatUsers((prev) => {
            return prev.filter((prevUser) => prevUser.user !== user.username);
          });
        }
      );

      socket.on("private message", (msgContent: ServerMessageContent) => {
        // setChatMessages([
        //   ...chatMessages,
        //   { message: msgContent.content, sender: msgContent.userName },
        // ]);
        setChatMessages((prevMessages) => {
          return [
            ...prevMessages,
            { message: msgContent.content, sender: msgContent.userName },
          ];
        });
      });

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
      socket.off("private message");
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

      {/* <Box component="div" sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileChatView
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        /> */}
      {/* </Box> */}
    </>
  );
};
