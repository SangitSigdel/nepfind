import { Box, Typography } from "@mui/material";
import React, { Dispatch } from "react";
import styled, { useTheme } from "styled-components";

import Cookies from "js-cookie";
import { CurrentChatWithType } from ".";

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

const CustomTypography = styled(Typography)`
  color: ${(props) => props.theme.palette.bright.main};
  margin: 0;
  padding: 0;
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

type ChatUsersProps = {
  users: ChatUsersType[];
  setCurrentChatWith: Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  currentChatWith?: CurrentChatWithType;
};

export const NewChatScreen = ({
  users,
  setCurrentChatWith,
  currentChatWith,
}: ChatUsersProps) => {
  const loggedInUser = Cookies.get("userName");
  const theme = useTheme();

  const chatView = (
    userName: string,
    userId: string,
    setBackground: boolean
  ) => {
    return (
      <UserListWrapper
        setBackground={setBackground}
        onClick={() => {
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
          <CustomTypography variant="h6">{userName}</CustomTypography>
          <StatusCircle online={true} />
        </div>
        <CustomTypography
          variant="subtitle1"
          sx={{ color: theme.palette.bright.light }}
        >
          {"Test message"}
          {/* {msg.chats[msg.chats.length - 1].message} */}
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
                ? chatView(el.user, el.userId, true)
                : chatView(el.user, el.userId, false)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
