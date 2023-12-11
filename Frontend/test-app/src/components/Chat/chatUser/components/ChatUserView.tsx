import { Badge, Box } from "@mui/material";
import { CustomTypography, RecentChat, UserListWrapper } from "../../style";
import React, { useContext } from "react";
import {
  refreshAuserChat,
  resetUserUnreadMessages,
} from "../../../../utils/api";

import ChatContext from "../../context/ChatContext";
import { ChatUsersType } from "../../types";
import Cookies from "js-cookie";
import { UserNameView } from "./UserNameView";
import { useTheme } from "styled-components";

export const ChatUserView = () => {
  const loggedInUser = Cookies.get("userName");
  const theme = useTheme();

  const chatContext = useContext(ChatContext);

  const chatView = (onlineUser: ChatUsersType, setbackground: boolean) => {
    const handleClick = async () => {
      await resetUserUnreadMessages(loggedInUser, onlineUser.user);
      await refreshAuserChat(onlineUser.user, chatContext.setChatUsers);
      chatContext.setCurrentChatWith({
        username: onlineUser.user,
        userID: onlineUser.userId,
      });
    };

    const RecentMsgWithNotificationBubble = () => (
      <CustomTypography
        variant="subtitle2"
        unreadmessages={onlineUser.unreadMsgs > 0}
        sx={{
          color: theme.palette.bright.light,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "200px",
          }}
        >
          <RecentChat>{onlineUser.recentMsg}</RecentChat>
          <Badge
            color="primary"
            badgeContent={
              onlineUser.unreadMsgs !== 0 ? onlineUser.unreadMsgs : null
            }
          />
        </div>
      </CustomTypography>
    );

    return (
      <UserListWrapper setbackground={setbackground} onClick={handleClick}>
        <UserNameView user={onlineUser} />
        <RecentMsgWithNotificationBubble />
      </UserListWrapper>
    );
  };

  return (
    <Box>
      {chatContext.chatUsers.map((onlineUser, index) => {
        return (
          <Box key={index}>
            {chatContext.currentChatWith?.username === onlineUser.user
              ? chatView(onlineUser, true)
              : chatView(onlineUser, false)}
          </Box>
        );
      })}
    </Box>
  );
};
