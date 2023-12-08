import { Box, Button } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ChatUsersType } from "../../types";
import React from "react";
import { UserListWrapper } from "../../style";
import { UserNameView } from "./UserNameView";

interface OnlinUserViewProps {
  setDisplayOnlineUser: React.Dispatch<React.SetStateAction<boolean>>;
  onlineUsers: ChatUsersType[];
}

export const OnlineUserView: React.FC<OnlinUserViewProps> = ({
  setDisplayOnlineUser,
  onlineUsers,
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
              <UserListWrapper>
                <UserNameView user={onlineUser} />
              </UserListWrapper>
            </Box>
          </div>
        );
      })}
    </Box>
  );
};
