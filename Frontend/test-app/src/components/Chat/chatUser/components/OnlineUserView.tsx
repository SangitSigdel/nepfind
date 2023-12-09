import { Box, Button } from "@mui/material";
import { ChatUsersType, CurrentChatWithType } from "../../types";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { UserListWrapper } from "../../style";
import { UserNameView } from "./UserNameView";

interface OnlinUserViewProps {
  setDisplayOnlineUser: React.Dispatch<React.SetStateAction<boolean>>;
  onlineUsers: ChatUsersType[];
  setCurrentChatWith: React.Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
}

export const OnlineUserView: React.FC<OnlinUserViewProps> = ({
  setDisplayOnlineUser,
  onlineUsers,
  setCurrentChatWith,
}) => {
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
                  setCurrentChatWith({
                    userID: onlineUser.userId,
                    username: onlineUser.user,
                  });
                  setDisplayOnlineUser(false);
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
