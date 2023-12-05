import { Badge, Box, Typography } from "@mui/material";
import { ChatMessagesType, CurrentChatWithType } from ".";
import React, { Dispatch } from "react";
import { refreshAuserChat, resetUserUnreadMessages } from "../../utils/api";
import styled, { useTheme } from "styled-components";

import Cookies from "js-cookie";

export interface UserData {
  status: string;
  data: Data;
}
export interface Data {
  _id: string;
  user_id: string;
  user_name: string;
  online: boolean;
  messages?: MessagesEntity[] | null;
  __v: number;
}
export interface MessagesEntity {
  user_id: string;
  chats?: ChatsEntity[] | null;
  _id: string;
}
export interface ChatsEntity {
  chat_id: number;
  message: string;
  messageByUser: boolean;
  dateTime: string;
  _id: string;
}

export type ChatUsersType = {
  user: string;
  status: string;
  userId: string;
  unreadMsgs: number;
  recentMsg: string;
};

type ChatUsersProps = {
  users: ChatUsersType[];
  setCurrentChatWith: Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  setChatUsers: Dispatch<React.SetStateAction<ChatUsersType[]>>;
  currentChatWith?: CurrentChatWithType;
  chatMessages: ChatMessagesType[];
};

const UserListWrapper = styled.div<{ setBackground?: boolean }>`
  padding: 10px 20px;
  margin-right: 5px;
  margin-top: 5px;
  background: ${(props) =>
    props.setBackground && props.theme.palette.primary.light};
  border-bottom: 1px solid ${(props) => props.theme.palette.border.main};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
  }
`;

const CustomTypography = styled(Typography)<{ unReadMessages: boolean }>`
  color: ${(props) => props.theme.palette.bright.light};
  margin: 0;
  padding: 0;

  &.MuiTypography-root {
    font-weight: ${(props) => props.unReadMessages && "bold"};
  }
`;

const UserDisplayHeader = styled.div`
  text-align: center;
  padding: 20px 0;
  background: ${(props) => props.theme.palette.primary.light};
  width: inherit;
`;

const StatusCircle = styled.div<{ online: boolean }>`
  width: 10px;
  height: 10px;
  margin: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.online ? "green" : "red")};
`;

export const NewChatScreen = ({
  users,
  chatMessages,
  setChatUsers,
  setCurrentChatWith,
  currentChatWith,
}: ChatUsersProps) => {
  const loggedInUser = Cookies.get("userName");
  const theme = useTheme();

  const chatView = (
    userName: string,
    userId: string,
    setBackground: boolean,
    noOfUnreadMessages: number,
    recentMessage: string
  ) => {
    return (
      <UserListWrapper
        setBackground={setBackground}
        onClick={async () => {
          await resetUserUnreadMessages(loggedInUser, userName);
          await refreshAuserChat(userName, setChatUsers);
          setCurrentChatWith({
            username: userName,
            userID: userId,
          });
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CustomTypography
            unReadMessages={noOfUnreadMessages > 0 ? true : false}
            variant="subtitle1"
          >
            {userName}
          </CustomTypography>
          <StatusCircle online={true} />
        </div>
        <CustomTypography
          variant="subtitle2"
          unReadMessages={noOfUnreadMessages > 0 ? true : false}
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
              {recentMessage}
            </p>
            <Badge
              color="primary"
              badgeContent={
                noOfUnreadMessages !== 0 ? noOfUnreadMessages : null
              }
            />
          </div>
        </CustomTypography>
      </UserListWrapper>
    );
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100vh",
        minWidth: "12em",
        overflowX: "hidden",
      }}
    >
      <UserDisplayHeader>
        <CustomTypography variant="h5">{loggedInUser}</CustomTypography>
      </UserDisplayHeader>
      <Box>
        {users.map((el, index) => {
          return (
            <Box>
              {currentChatWith?.username === el.user
                ? chatView(
                    el.user,
                    el.userId,
                    true,
                    el.unreadMsgs,
                    el.recentMsg
                  )
                : chatView(
                    el.user,
                    el.userId,
                    false,
                    el.unreadMsgs,
                    el.recentMsg
                  )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
