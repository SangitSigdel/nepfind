import React, { useState } from "react";

import { Box } from "@mui/material";
import { ChatScreen } from "./ChatScreen";
import { ChatUsers } from "./ChatUsers";
import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import { MobileChatView } from "./MobileChatView";
import _ from "lodash";
import api from "../../utils/api";
import socket from "../../utils/socket";
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

  const sendPrivateMessage = async (content: string) => {
    const user = Cookies.get("userName");
    try {
      await api.post(`/chat/${user}`, {
        chatUserId: currentChatWith?.username,
        chatMessage: content,
      });
      socket.emit("private message", {
        content: content,
        to: currentChatWith?.userID,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userName = Cookies.get("userName");
    if (!userName) {
      navigate("/");
    } else {
      if (currentChatWith) {
        api
          .get(`/chat/${userName}?chatUserId=${currentChatWith.username}`)
          .then((res) => {
            //  Todo: define response type for this to prevent mistakes on data obtain

            const chats = res.data.messages?.chats;

            !_.isEqual(chats, chatMessages) && setChatMessages(chats);
          })
          .catch((err) => console.log(err));
      }

      socket.connect();
      socket.auth = { userName };

      socket.on("users", (users) => {
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
        (user: { username: string; userID: string }) => {
          setChatUsers((prev) => {
            return prev.filter((prevUser) => prevUser.user !== user.username);
          });
        }
      );

      socket.on("private message", async (msgContent: ServerMessageContent) => {
        const user = Cookies.get("userName");

        try {
          const newMessages = await api.get(`/chat/${user}`, {
            params: {
              chatUserId: currentChatWith?.username,
            },
          });

          setChatMessages(newMessages.data.messages.chats);
        } catch (error) {
          console.log(error);
        }
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
  }, [navigate, currentChatWith, chatMessages]);

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
