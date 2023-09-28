import { Box, Container, IconButton, Menu, TextField } from "@mui/material";
import React, { useState } from "react";

import Cookies from "js-cookie";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SelectUserWrapper = styled.div<{ drawerOpen: boolean }>`
  width: ${(param) => !param.drawerOpen && "15%"};
  padding-right: 20px;
  p {
    font-size: 18px;
    margin: 0.2em;
  }

  background-color: #3f0e40;
  color: #ffff;
  padding-top: 20px;
  height: calc(100vh - 20px);
  padding-left: 2em;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  width: 100%;
  margin-bottom: 2rem;
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

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

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

  const SelectUser = () => {
    return (
      <SelectUserWrapper drawerOpen={drawerOpen}>
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
        <Container maxWidth={"xl"}>
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
              autoFocus={true}
              fullWidth={true}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                e.ctrlKey &&
                setChatMessages([...chatMessages, { message, sender: "user" }])
              }
            />
            <IconButton
              onClick={() =>
                setChatMessages([...chatMessages, { message, sender: "user" }])
              }
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Container>
      </ChatScreenWrapper>
    );
  };

  const MobileView = () => {
    return (
      <Container fixed>
        {!drawerOpen ? (
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        ) : (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ width: "100%" }}
          >
            <SelectUser />
          </Drawer>
        )}
        <Box
          component="div"
          sx={{
            position: "absolute",
            bottom: "0",
            width: "90%",
          }}
        >
          <ChatScreen />
        </Box>
      </Container>
    );
  };

  const WebView = () => {
    return (
      <ChatWrapper>
        <SelectUser />
        <ChatScreen />
      </ChatWrapper>
    );
  };

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
        <WebView />
      </Box>
      <Box component="div" sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileView />
      </Box>
    </>
  );
};
