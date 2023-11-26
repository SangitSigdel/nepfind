import { Box, Container, IconButton, TextField } from "@mui/material";
import { ChatMessagesType, CurrentChatWithType } from "./index";

import SendIcon from "@mui/icons-material/Send";
import { sendMessage } from "../../utils/api";
import styled from "styled-components";
import { useState } from "react";

const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  width: 100%;
  margin-bottom: 2rem;
`;

const MessagesWrapper = styled.div<{ messageByUser: boolean }>`
  text-align: ${(props) => !props.messageByUser && "right"};
  padding: 10px;
`;

export type ChatScreenProps = {
  chatMessages: ChatMessagesType[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessagesType[]>>;
  chatMessagesWith?: CurrentChatWithType;
};

export const ChatScreen = ({
  chatMessages,
  setChatMessages,
  chatMessagesWith,
}: ChatScreenProps) => {
  const [message, setMessage] = useState<string>("");

  return (
    <ChatScreenWrapper>
      <h1>
        {chatMessagesWith
          ? chatMessagesWith.username
          : " Please select user to continue"}
      </h1>
      <Container maxWidth={"xl"}>
        {chatMessages.map((chat, index) => {
          return (
            <MessagesWrapper messageByUser={chat.messageByUser} key={index}>
              <p>{chat.message}</p>
            </MessagesWrapper>
          );
        })}

        {chatMessagesWith && (
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  sendMessage(chatMessagesWith?.username, message);
                  setMessage("");
                }
              }}
            />
            <IconButton
              onClick={() => {
                sendMessage(chatMessagesWith?.username, message);
                setMessage("");
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Container>
    </ChatScreenWrapper>
  );
};
