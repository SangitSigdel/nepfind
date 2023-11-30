import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ChatMessagesType, CurrentChatWithType } from "./index";

import SendIcon from "@mui/icons-material/Send";
import styled from "styled-components";
import { useState } from "react";

const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2rem;
`;

const MessagesWrapper = styled.div<{ messageByUser: boolean }>`
  text-align: ${(props) => !props.messageByUser && "right"};
  padding: 10px;
  color: #ffff;
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

  return (
    <ChatScreenWrapper>
      <ChatHeader>
        <Typography variant="h3">
          {chatMessagesWith
            ? chatMessagesWith.username
            : " Please select user to continue"}
        </Typography>
      </ChatHeader>

      <Container maxWidth="xl">
        {chatMessages?.map((chat, index) => {
          return (
            <MessagesWrapper messageByUser={chat.messageByUser} key={index}>
              <p>{chat.message}</p>
            </MessagesWrapper>
          );
        })}
      </Container>

      {chatMessagesWith && (
        <Box
          sx={{
            display: "flex",
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            width: "100%",
            background: "#008892",
            paddingBottom: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              marginLeft: "2.5rem",
            }}
          >
            <TextField
              required
              id="outlined-required"
              label="Message"
              value={message}
              sx={{
                width: "70%",
                marginTop: "20px",
                background: "#ffff",
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
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </ChatScreenWrapper>
  );
};
