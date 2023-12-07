import { ChatUserWrapper, CustomTypography, UserDisplayHeader } from "../style";

import { ChatUsersProps } from "../types";
import Cookies from "js-cookie";
import { OnlineUserList } from "./components/OnlineUserList";

export const ChatUsers = ({
  users,
  setChatUsers,
  setCurrentChatWith,
  currentChatWith,
}: ChatUsersProps) => {
  const loggedInUser = Cookies.get("userName");

  return (
    <ChatUserWrapper>
      <UserDisplayHeader>
        <CustomTypography variant="h5">{loggedInUser}</CustomTypography>
      </UserDisplayHeader>
      <OnlineUserList
        onlineUsers={users}
        setChatUsers={setChatUsers}
        setCurrentChatWith={setCurrentChatWith}
        currentChatWith={currentChatWith}
      />
    </ChatUserWrapper>
  );
};
