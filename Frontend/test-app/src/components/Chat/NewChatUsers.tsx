import { Box, Typography } from "@mui/material";

import Cookies from "js-cookie";
import React from "react";
import styled from "styled-components";
import userData from "./data.json";

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
  position: fixed;
  width: inherit;
`;

const StatusCircle = styled.div<{ online: boolean }>`
  width: 10px;
  height: 10px;
  margin: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.online ? "green" : "red")};
`;

export const NewChatScreen = () => {
  const loggedInUser = Cookies.get("userName");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100vh",
        width: "20em",
        overflowX: "hidden",
      }}
    >
      <UserDisplayHeader>
        <CustomTypography variant="h5">{loggedInUser}</CustomTypography>
      </UserDisplayHeader>
      <Box sx={{ marginTop: "4.2em" }}>
        {userData.data.messages.map((msg, index) => {
          return (
            <Box>
              <UserListWrapper>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CustomTypography variant="h5">
                    {msg.user_id}
                  </CustomTypography>
                  <StatusCircle online={true} />
                </div>
                <CustomTypography variant="h6" sx={{ color: "#ffffffc3" }}>
                  {" "}
                  {msg.chats[msg.chats.length - 1].message}
                </CustomTypography>
              </UserListWrapper>
            </Box>
          );
        })}
      </Box>
    </div>
  );
};
