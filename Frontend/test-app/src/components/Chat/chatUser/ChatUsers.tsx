import { ChatUserWrapper, CustomTypography, UserDisplayHeader } from "../style";

import { Button } from "@mui/material";
import { ChatUserView } from "./components/ChatUserView";
import { ChatUsersProps } from "../types";
import Cookies from "js-cookie";
import { OnlineUserView } from "./components/OnlineUserView";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState } from "react";

export const NewChatScreen = ({
  users,
  setChatUsers,
  onlineUsers,
  setCurrentChatWith,
  currentChatWith,
}: ChatUsersProps) => {
  const loggedInUser = Cookies.get("userName");

  const [displayOnlineUsers, setDisplayOnlinUsers] = useState<boolean>(false);

  const handleClick = () => {
    setDisplayOnlinUsers(true);
  };

  return (
    <ChatUserWrapper>
      <UserDisplayHeader>
        <CustomTypography variant="h5">{loggedInUser}</CustomTypography>
        <Button
          sx={{
            color: "white",
            cursor: "pointer",
            borderRadius: "50px",
            marginRight: "20px",
          }}
          onClick={handleClick}
        >
          <PersonAddAlt1Icon />
        </Button>
      </UserDisplayHeader>
      {displayOnlineUsers ? (
        <OnlineUserView
          setDisplayOnlineUser={setDisplayOnlinUsers}
          onlineUsers={onlineUsers}
          setCurrentChatWith={setCurrentChatWith}
          setChatUsers={setChatUsers}
        />
      ) : (
        <ChatUserView
          users={users}
          setChatUsers={setChatUsers}
          setCurrentChatWith={setCurrentChatWith}
          currentChatWith={currentChatWith}
        />
      )}
    </ChatUserWrapper>
  );
};
