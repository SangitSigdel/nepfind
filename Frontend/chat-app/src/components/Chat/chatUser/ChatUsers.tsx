import { ChatUserWrapper, CustomTypography, UserDisplayHeader } from "../style";

import { Button } from "@mui/material";
import ChatContext from "../context/ChatContext";
import { ChatUserView } from "./components/ChatUserView";
import Cookies from "js-cookie";
import { OnlineUserView } from "./components/OnlineUserView";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useContext } from "react";

export const NewChatScreen = () => {
  const loggedInUser = Cookies.get("userName");

  const chatContext = useContext(ChatContext);

  const handleClick = () => {
    chatContext.setDisplayOnlinUsers(true);
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
      {chatContext.displayOnlineUsers ? <OnlineUserView /> : <ChatUserView />}
    </ChatUserWrapper>
  );
};
