import { Badge, Box } from "@mui/material";
import {
  ChatUserWrapper,
  CustomTypography,
  StatusCircle,
  UserDisplayHeader,
  UserListWrapper,
} from "../style";
import { ChatUsersProps, ChatUsersType } from "../types";
import { refreshAuserChat, resetUserUnreadMessages } from "../../../utils/api";

import Cookies from "js-cookie";
import { useTheme } from "styled-components";

export const NewChatScreen = ({
  users,
  setChatUsers,
  setCurrentChatWith,
  currentChatWith,
}: ChatUsersProps) => {
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

    return (
      <UserListWrapper setBackground={setBackground} onClick={handleClick}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CustomTypography
            unReadMessages={onlineUser.unreadMsgs > 0 ? true : false}
            variant="subtitle1"
          >
            {onlineUser.user}
          </CustomTypography>
          <StatusCircle online={true} />
        </div>
        <CustomTypography
          variant="subtitle2"
          unReadMessages={onlineUser.unreadMsgs > 0}
          sx={{
            color: theme.palette.bright.light,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {onlineUser.recentMsg}
            </p>
            <Badge
              color="primary"
              badgeContent={
                onlineUser.unreadMsgs !== 0 ? onlineUser.unreadMsgs : null
              }
            />
          </div>
        </CustomTypography>
      </UserListWrapper>
    );
  };

  return (
    <ChatUserWrapper>
      <UserDisplayHeader>
        <CustomTypography variant="h5">{loggedInUser}</CustomTypography>
      </UserDisplayHeader>
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
    </ChatUserWrapper>
  );
};
