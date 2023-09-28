import { Box, Container, IconButton, TextField } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import { chatMessagesType } from "./index";
import styled from "styled-components";
import { useState } from "react";

const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  width: 100%;
  margin-bottom: 2rem;
`;

const MessagesWrapper = styled.div<{ from: "user" | "other" }>`
  text-align: ${(props) => props.from === "other" && "right"};
`;

export type ChatScreenProps = {
  chatMessages: chatMessagesType[];
  setChatMessages: React.Dispatch<React.SetStateAction<chatMessagesType[]>>;
};

export const ChatScreen = ({
  chatMessages,
  setChatMessages,
}: ChatScreenProps) => {
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                setChatMessages([...chatMessages, { message, sender: "user" }]);
                setMessage("");
              }
            }}
          />
          <IconButton
            onClick={() => {
              setChatMessages([...chatMessages, { message, sender: "user" }]);
              setMessage("");
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </ChatScreenWrapper>
  );
};
