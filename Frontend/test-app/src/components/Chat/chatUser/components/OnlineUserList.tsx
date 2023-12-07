import { Badge, Box } from "@mui/material";
import { ChatUsersType, CurrentChatWithType } from "../../types";
import {
  CustomTypography,
  RecentChat,
  StatusCircle,
  UserListWrapper,
} from "../../style";
import React, { useEffect, useState } from "react";
import {
  getUserDetails,
  refreshAuserChat,
  resetUserUnreadMessages,
} from "../../../../utils/api";

import Cookies from "js-cookie";
import { useTheme } from "styled-components";

type OnlineUserListProps = {
  onlineUsers: ChatUsersType[];
  setChatUsers: React.Dispatch<React.SetStateAction<ChatUsersType[]>>;
  setCurrentChatWith: React.Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  currentChatWith: CurrentChatWithType | undefined;
};

export const OnlineUserList = ({
  onlineUsers,
  setChatUsers,
  setCurrentChatWith,
  currentChatWith,
}: OnlineUserListProps) => {
  const loggedInUser = Cookies.get("userName") as string;
  const theme = useTheme();

  const [abc, setAbc] = useState<ChatUsersType[]>([]);

  // shapping the userData from api as a chatuserdata

  const shapeUserData = async () => {
    let userDataShappedAsChatUsers: ChatUsersType[] = [];
    try {
      const userData = await getUserDetails(loggedInUser);

      userData.data.data.messages.map((msg, index) => {
        userDataShappedAsChatUsers.push({
          user: msg.user_id,
          status: "offline",
          socketId: "",
          noOfUnreadMsgs: msg.unread,
          recentMsg: msg.chats[msg.chats.length - 1].message,
        });
      });

      userDataShappedAsChatUsers.map((shappedUser) => {
        const matchingOnlineUser = onlineUsers.find(
          (onlineUser) => onlineUser.user === shappedUser.user
        );
        return {
          ...shappedUser,
          socketId: matchingOnlineUser?.socketId,
          status: matchingOnlineUser?.status,
        };
      });

      setAbc(userDataShappedAsChatUsers);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    shapeUserData();
  }, []);

  // Add socket ID to userDataShappedAsChatUser and set status to online if user is online

  const chatView = (onlineUser: ChatUsersType, setBackground: boolean) => {
    const handleClick = async () => {
      await resetUserUnreadMessages(loggedInUser, onlineUser.user);
      await refreshAuserChat(onlineUser.user, setChatUsers);
      setCurrentChatWith({
        username: onlineUser.user,
        socketID: onlineUser.socketId,
      });
    };

    const UserNameWithStatusCircle = () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <CustomTypography
          unReadMessages={onlineUser.noOfUnreadMsgs > 0 ? true : false}
          variant="subtitle1"
        >
          {onlineUser.user}
        </CustomTypography>
        <StatusCircle online={true} />
      </div>
    );

    const RecentMsgWithNotificationBubble = () => (
      <CustomTypography
        variant="subtitle2"
        unReadMessages={onlineUser.noOfUnreadMsgs > 0}
        sx={{
          color: theme.palette.bright.light,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <RecentChat>{onlineUser.recentMsg}</RecentChat>
          <Badge
            color="primary"
            badgeContent={
              onlineUser.noOfUnreadMsgs !== 0 ? onlineUser.noOfUnreadMsgs : null
            }
          />
        </div>
      </CustomTypography>
    );

    return (
      <UserListWrapper setBackground={setBackground} onClick={handleClick}>
        <UserNameWithStatusCircle />
        <RecentMsgWithNotificationBubble />
      </UserListWrapper>
    );
  };

  return (
    <Box>
      {abc.map((onlineUser, index) => {
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
