import { Box, Button } from "@mui/material";
import { ChatUsersType, CurrentChatWithType } from "../../types";
import {
  refreshAuserChat,
  resetUserUnreadMessages,
} from "../../../../utils/api";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import React from "react";
import { UserListWrapper } from "../../style";
import { UserNameView } from "./UserNameView";

interface OnlinUserViewProps {
  setDisplayOnlineUser: React.Dispatch<React.SetStateAction<boolean>>;
  onlineUsers: ChatUsersType[];
  setCurrentChatWith: React.Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  setChatUsers: React.Dispatch<React.SetStateAction<ChatUsersType[]>>;
}

export const OnlineUserView: React.FC<OnlinUserViewProps> = ({
  setDisplayOnlineUser,
  onlineUsers,
  setCurrentChatWith,
  setChatUsers,
}) => {
  const loggedInUser = Cookies.get("userName");

  const handleClick = async (onlineUser: ChatUsersType) => {
    await resetUserUnreadMessages(loggedInUser, onlineUser.user);
    await refreshAuserChat(onlineUser.user, setChatUsers);
    setCurrentChatWith({
      username: onlineUser.user,
      userID: onlineUser.userId,
    });
    setDisplayOnlineUser(false);
  };
  return (
    <Box>
      <Button
        sx={{ color: "green", marginTop: "20px" }}
        onClick={() => setDisplayOnlineUser(false)}
      >
        <ArrowBackIcon />
      </Button>
      {onlineUsers.map((onlineUser, index) => {
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
