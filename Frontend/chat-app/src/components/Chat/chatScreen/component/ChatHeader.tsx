import { ChatHeaderWrapper } from "../../style";
import React from "react";
import { Typography } from "@mui/material";
import theme from "../../../../utils/theme";

export const ChatHeader = ({
  currentChatWith,
}: {
  currentChatWith: string;
}) => {
  return (
    <ChatHeaderWrapper>
      <Typography variant="h6">{currentChatWith}</Typography>
    </ChatHeaderWrapper>
  );
};
