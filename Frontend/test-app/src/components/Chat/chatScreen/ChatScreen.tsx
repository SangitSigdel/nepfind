import { ChatHeader, ChatScreenWrapper } from "../style";

import { ChatMessages } from "./component/ChatMessages";
import { ChatScreenProps } from "../types";
import { MessageInput } from "./component/MessageInput";
import { Typography } from "@mui/material";
import { useState } from "react";

export const ChatScreen = ({
  chatMessages,
  chatMessagesWith,
  sendPrivateMessage,
}: ChatScreenProps) => {
  const [message, setMessage] = useState<string>("");

  return (
    <ChatScreenWrapper>
      <ChatHeader>
        <Typography variant="h6">
          {chatMessagesWith
            ? chatMessagesWith.username
            : " Please select user to continue"}
        </Typography>
      </ChatHeader>

      <ChatMessages chatMessages={chatMessages} />

      {chatMessagesWith && (
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendPrivateMessage={sendPrivateMessage}
        />
      )}
    </ChatScreenWrapper>
  );
};
