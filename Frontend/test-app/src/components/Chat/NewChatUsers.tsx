import { Box, Typography } from "@mui/material";
import React, { Dispatch } from "react";

import { ChatUsersType } from "./ChatUsers";
import Cookies from "js-cookie";
import { CurrentChatWithType } from ".";
import styled from "styled-components";

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

const UserListWrapper = styled.div`
  background: #005a61;
  border-bottom: 1px solid #ffffff6a;
  padding: 10px 20px;
  cursor: pointer;
`;

const CustomTypography = styled(Typography)`
  color: #ffff;
  margin: 0;
  padding: 0;
`;

const UserDisplayHeader = styled.div`
  text-align: center;
  padding: 20px 0;
  background: #008892;
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
}: ChatUsersProps) => {
  const loggedInUser = Cookies.get("userName");
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
              <UserListWrapper
                onClick={() =>
                  setCurrentChatWith({
                    username: el.user,
                    userID: el.userId,
                  })
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CustomTypography variant="h6">{el.user}</CustomTypography>
                  <StatusCircle online={true} />
                </div>
                <CustomTypography
                  variant="subtitle1"
                  sx={{ color: "#ffffffc3" }}
                >
                  {"Test message"}
                  {/* {msg.chats[msg.chats.length - 1].message} */}
                </CustomTypography>
              </UserListWrapper>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
