import { Box, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";

import Cookies from "js-cookie";
import SendIcon from "@mui/icons-material/Send";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SelectUserWrapper = styled.div`
  width: 15%;
  p {
    font-size: 18px;
    margin: 0.2em;
  }

  background-color: #3f0e40;
  color: #ffff;
  height: 100vh;
  padding-left: 2em;
  padding-top: 20px;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  width: 100%;
  margin-bottom: 2rem;
  padding: 20px;
`;

const MessagesWrapper = styled.div<{ from: "user" | "other" }>`
  text-align: ${(props) => props.from === "other" && "right"};
`;

type chatMessages = {
  message: string;
  sender: "user" | "other";
};

export const Chat = () => {
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState<chatMessages[]>([]);

  useEffect(() => {
    if (!Cookies.get("userName")) {
      navigate("/");
    }
  }, [navigate]);

  const onlineUsers = [
    {
      user: "Player 1 (yourself)",
      status: "online",
    },
    {
      user: "Player 2",
      status: "online",
    },
    {
      user: "Player 3",
      status: "online",
    },
  ];

  const handleClick = (message: string) => {
    setChatMessages([...chatMessages, { message, sender: "user" }]);
  };

  const SelectUser = () => {
    return (
      <SelectUserWrapper>
        {onlineUsers.map((el, index) => (
          <div key={index}>
            <p>{el.user}</p>
            <p style={{ color: "#d1d1d1", marginBottom: "20px" }}>
              {el.status}
            </p>
          </div>
        ))}
      </SelectUserWrapper>
    );
  };

  const ChatScreen = () => {
    const [message, setMessage] = useState<string>("");
    return (
      <ChatScreenWrapper>
        {chatMessages.map((chat, index) => {
          return (
            <MessagesWrapper from={chat.sender} key={index}>
              <p>{chat.message}</p>
            </MessagesWrapper>
          );
        })}

        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: "2em",
          }}
        >
          <TextField
            required
            id="outlined-required"
            label="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            fullWidth={true}
          />
          <IconButton onClick={(e) => handleClick(message)}>
            <SendIcon />
          </IconButton>
        </Box>
      </ChatScreenWrapper>
    );
  };

  return (
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
        <SelectUser />
        <ChatScreen />
      </ChatWrapper>
    </Box>
  );
};
