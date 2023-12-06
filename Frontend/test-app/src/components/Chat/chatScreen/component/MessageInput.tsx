import { IconButton, TextField } from "@mui/material";

import { MessageTextFieldWrapper } from "../../style";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "styled-components";

type MessageInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendPrivateMessage: (content: string) => void;
};

export const MessageInput = ({
  message,
  setMessage,
  sendPrivateMessage,
}: MessageInputProps) => {
  const theme = useTheme();

  const sendAndResetMessage = () => {
    sendPrivateMessage(message);
    setMessage("");
  };

  return (
    <MessageTextFieldWrapper>
      <TextField
        required
        id="filled-search"
        label="Message"
        variant="filled"
        value={message}
        sx={{
          width: "70%",
          marginTop: "20px",
          background: theme.palette.bright.main,
          borderRadius: "10px",
        }}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        autoFocus={true}
        fullWidth={true}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            sendAndResetMessage();
          }
        }}
      />
      <IconButton
        sx={{ color: theme.palette.bright.main }}
        onClick={sendAndResetMessage}
      >
        <SendIcon sx={{ marginTop: "20px" }} />
      </IconButton>
    </MessageTextFieldWrapper>
  );
};
