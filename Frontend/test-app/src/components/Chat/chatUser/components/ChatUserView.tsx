import { Badge, Box } from "@mui/material";
import { ChatUsersType, CurrentChatWithType } from "../../types";
import {
  CustomTypography,
  RecentChat,
  StatusCircle,
  UserListWrapper,
} from "../../style";
import {
  refreshAuserChat,
  resetUserUnreadMessages,
} from "../../../../utils/api";

import Cookies from "js-cookie";
import React from "react";
import { UserNameView } from "./UserNameView";
import { useTheme } from "styled-components";

type OnlineUserListProps = {
  users: ChatUsersType[];
  setChatUsers: React.Dispatch<React.SetStateAction<ChatUsersType[]>>;
  setCurrentChatWith: React.Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  currentChatWith: CurrentChatWithType | undefined;
};

export const ChatUserView = ({
  users,
  setChatUsers,
  setCurrentChatWith,
  currentChatWith,
}: OnlineUserListProps) => {
  const loggedInUser = Cookies.get("userName");
  const theme = useTheme();

  const chatView = (onlineUser: ChatUsersType, setBackground: boolean) => {
    const handleClick = async () => {
      await resetUserUnreadMessages(loggedInUser, onlineUser.user);
      await refreshAuserChat(onlineUser.user, setChatUsers);
      setCurrentChatWith({
        username: onlineUser.user,
        userID: onlineUser.userId,
      });
    };

    const RecentMsgWithNotificationBubble = () => (
      <CustomTypography
        variant="subtitle2"
        unReadMessages={onlineUser.unreadMsgs > 0}
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
      <UserListWrapper setBackground={setBackground} onClick={handleClick}>
        <UserNameView user={onlineUser} />
        <RecentMsgWithNotificationBubble />
      </UserListWrapper>
    );
  };

  return (
    <Box>
      {users.map((onlineUser, index) => {
        return (
          <Box key={index}>
            {currentChatWith?.username === onlineUser.user
              ? chatView(onlineUser, true)
              : chatView(onlineUser, false)}
          </Box>
        );
      })}
    </Box>
  );
};
