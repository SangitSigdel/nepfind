import React, { useReducer, useState } from "react";

import { Box } from "@mui/material";
import { ChatScreen } from "./ChatScreen";
import { ChatUsers } from "./ChatUsers";
import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
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

type reducerStateType = {
  chatMessages: ChatMessagesType[];
  chatUsers: ChatUsersType[];
  currentChatWithtemp: CurrentChatWithType;
};

enum reducerTypes {
  initilizeChatForCurrentUser = "initilizeChatForCurrentChatUser",
  setChatMessages = "setChatMessages",
  setChatUsers = "setChatUsers",
}

export const Chat = () => {
  const navigate = useNavigate();

  const initialState: reducerStateType = {
    chatMessages: [],
    chatUsers: [],
    currentChatWithtemp: { userID: "", username: "" },
  };

  // const [chatUsers, setChatUsers] = useState<ChatUsersType[]>([]);

  const [currentChatWith, setCurrentChatWith] = useState<CurrentChatWithType>();

  const reducer = (
    state: reducerStateType,
    action: { type: string; payload: any }
  ) => {
    const userName = Cookies.get("userName");
    switch (action.type) {
      case "initilizeChatForCurrentChatUser":
        api
          .get(`/chat/${userName}?chatUserId=${currentChatWith?.username}`)
          .then((res) => {
            dispatch({
              type: "setChatMessages",
              payload: res.data.messages.chats,
            });
          })
          .catch((err) => console.log(err));
        return state;

      case "setChatMessages":
        return { ...state, chatMessages: action.payload };

      case "setChatUsers":
        return { ...state, chatUsers: action.payload };
      default:
        throw new Error("sorry the requested action type was not found");
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const sendPrivateMessage = async (content: string) => {
    const user = Cookies.get("userName");
    try {
      await api.post(`/chat/${user}`, {
        chatUserId: currentChatWith?.username,
        chatMessage: content,
      });
      dispatch({
        type: reducerTypes.initilizeChatForCurrentUser,
        payload: null,
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
        dispatch({
          type: reducerTypes.initilizeChatForCurrentUser,
          payload: null,
        });
      }

      socket.connect();
      socket.auth = { userName };

      socket.on("users", (users) => {
        const updatedUser = users.filter(
          (user: { userID: string }) => user.userID !== socket.id
        );

        updatedUser.map((el: { userID: string; username: string }) => {
          dispatch({
            type: reducerTypes.setChatUsers,
            payload: [
              { user: el.username, status: "online", userId: el.userID },
            ],
          });
        });
      });

      socket.on(
        "user connected",
        (user: { username: string; userID: string }) => {
          dispatch({
            type: reducerTypes.setChatUsers,
            payload: [
              {
                user: user.username,
                status: "online",
                userId: user.userID,
              },
            ],
          });
        }
      );

      socket.on(
        "user disconnected",
        (user: { username: string; userID: string }) => {
          dispatch({
            type: reducerTypes.setChatUsers,
            payload: [
              state.chatUsers.filter(
                (prevUser: any) => prevUser.user !== user.username
              ),
            ],
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
          dispatch({
            type: reducerTypes.setChatMessages,
            payload: newMessages.data.messages.chats,
          });
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
  }, [navigate, currentChatWith, dispatch, state.chatUsers]);

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
            users={state.chatUsers}
            setCurrentChatWith={setCurrentChatWith}
            currentChatWith={currentChatWith}
          />
          <ChatScreen
            reducerState={state}
            chatMessagesWith={currentChatWith}
            sendPrivateMessage={sendPrivateMessage}
          />
        </ChatWrapper>
      </Box>
    </>
  );
};
