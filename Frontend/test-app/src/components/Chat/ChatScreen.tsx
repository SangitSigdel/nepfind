import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ChatMessagesType, CurrentChatWithType } from "./index";
import { useEffect, useRef, useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import styled from "styled-components";

const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;
`;

const MessagesWrapper = styled.div<{ messageByUser: boolean }>`
  align-self: ${(props) => (!props.messageByUser ? "flex-end" : "flex-start")};
  padding: 10px;
  color: #ffff;
  border-radius: 20px;
  background-color: ${(props) => (props.messageByUser ? "#202c33ce" : "green")};
`;

const ChatHeader = styled.div`
  background: #005a61;
  padding: 8px 0;
  margin: 0;
  top: 0;
  position: fixed;
  width: 100vw;
  text-align: center;
  color: white;
`;

export type ChatScreenProps = {
  chatMessages: ChatMessagesType[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessagesType[]>>;
  chatMessagesWith?: CurrentChatWithType;
  sendPrivateMessage: (content: string) => void;
};

export const ChatScreen = ({
  chatMessages,
  setChatMessages,
  chatMessagesWith,
  sendPrivateMessage,
}: ChatScreenProps) => {
  const [message, setMessage] = useState<string>("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chatMessages]);

  return (
    <ChatScreenWrapper>
      <ChatHeader>
        <Typography variant="h3">
          {chatMessagesWith
            ? chatMessagesWith.username
            : " Please select user to continue"}
        </Typography>
      </ChatHeader>

      <Container
        maxWidth="xl"
        sx={{
          height: "80vh",
          top: "100px",
          overflowY: "auto",
          width: "80%",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {chatMessages?.map((chat, index) => {
            return (
              <MessagesWrapper messageByUser={chat.messageByUser} key={index}>
                <p style={{ maxWidth: "20rem", padding: "5px" }}>
                  {chat.message}
                </p>
                <div ref={messageEndRef} />
              </MessagesWrapper>
            );
          })}
        </div>
      </Container>

      {chatMessagesWith && (
        <Box
          sx={{
            display: "flex",
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            background: "#008892",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <TextField
              required
              id="filled-search"
              label="Message"
              variant="filled"
              value={message}
              sx={{
                width: "70%",
                marginTop: "20px",
                background: "#ffff",
                borderRadius: "50px",
              }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              autoFocus={true}
              fullWidth={true}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  sendPrivateMessage(message);
                  setMessage("");
                }
              }}
            />
            <IconButton
              sx={{ color: "#ffff" }}
              onClick={() => {
                sendPrivateMessage(message);
                setMessage("");
              }}
            >
              <SendIcon sx={{ marginTop: "20px" }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </ChatScreenWrapper>
  );
};
