import { Box, Button } from "@mui/material";
import React, { useContext } from "react";
import {
  refreshAuserChat,
  resetUserUnreadMessages,
} from "../../../../utils/api";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatContext from "../../context/ChatContext";
import { ChatUsersType } from "../../types";
import Cookies from "js-cookie";
import { UserListWrapper } from "../../style";
import { UserNameView } from "./UserNameView";

export const OnlineUserView = () => {
  const loggedInUser = Cookies.get("userName");

  const chatContext = useContext(ChatContext);

  const handleClick = async (onlineUser: ChatUsersType) => {
    await resetUserUnreadMessages(loggedInUser, onlineUser.user);
    await refreshAuserChat(onlineUser.user, chatContext.setChatUsers);
    chatContext.setCurrentChatWith({
      username: onlineUser.user,
      userID: onlineUser.userId,
    });
    chatContext.setDisplayOnlinUsers(false);
  };
  return (
    <Box>
      <Button
        sx={{ color: "green", marginTop: "20px" }}
        onClick={() => chatContext.setDisplayOnlinUsers(false)}
      >
        <ArrowBackIcon />
      </Button>
      {chatContext.onlineUsers.map((onlineUser, index) => {
        return (
          <div>
            <Box key={index}>
              <UserListWrapper
                onClick={() => {
                  handleClick(onlineUser);
                }}
              >
                <UserNameView user={onlineUser} />
              </UserListWrapper>
            </Box>
          </div>
        );
      })}
    </Box>
  );
};
