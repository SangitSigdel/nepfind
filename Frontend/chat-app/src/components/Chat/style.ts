import { Box, Container, Typography } from "@mui/material";

import styled from "styled-components";

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ChatScreenWrapper = styled.div`
  align-self: flex-end;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  width: 100%;
`;

export const ChatScreenContainer = styled(Container)`
  height: 80vh;
  top: 100px;
  overflow-y: auto;
  width: 80%;
  margin: 0 auto;
`;

export const MessagesWrapper = styled.div<{ messageByUser: boolean }>`
  align-self: ${(props) => (!props.messageByUser ? "flex-end" : "flex-start")};
  padding: 10px;
  color: ${(props) => props.theme.palette.bright.main};
  border-radius: 20px;
  background-color: ${(props) =>
    props.messageByUser
      ? props.theme.palette.chatBubble.sendMessageBubble
      : props.theme.palette.chatBubble.recieveMessageBubble};
  max-width: 20rem;
`;

export const ChatHeaderWrapper = styled.div`
  background: ${(props) => props.theme.palette.primary.light};
  color: ${(props) => props.theme.palette.bright.main};
  padding: 22px;
  margin: 0;
  text-align: center;
  top: 0;
  position: fixed;
  width: 100vw;
  color: "red";
`;

export const MessageInputFieldViewWrapper = styled(Box)`
  display: flex;
  bottom: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const MessageTextFieldWrapper = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const ChatUserWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
  width: 15em;
  overflow-x: hidden;
`;

export const UserListWrapper = styled.div<{ setbackground?: boolean }>`
  padding: 10px 20px;
  margin-right: 5px;
  margin-top: 5px;
  background: ${(props) =>
    props.setbackground && props.theme.palette.primary.light};
  border-bottom: 1px solid ${(props) => props.theme.palette.border.main};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
  }
`;

export const CustomTypography = styled(Typography)<{ unreadmessages: boolean }>`
  color: ${(props) => props.theme.palette.bright.light};
  margin: 0;
  padding: 0;

  &.MuiTypography-root {
    font-weight: ${(props) => props.unreadmessages && "bold"};
  }
`;

export const UserDisplayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: ${(props) => props.theme.palette.primary.light};
  width: inherit;
`;

export const StatusCircle = styled.div<{ online: boolean }>`
  width: 10px;
  height: 10px;
  margin: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.online ? "green" : "red")};
`;

export const ChatListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RecentChat = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
`;

export const InitialScreenTextWrapper = styled(Typography)`
  && {
    display: flex;
    color: white;
    height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;
