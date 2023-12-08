import { CustomTypography, StatusCircle } from "../../style";

import { ChatUsersType } from "../../types";
import React from "react";

export const UserNameView = ({ user }: { user: ChatUsersType }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <CustomTypography
        unReadMessages={user.unreadMsgs > 0 ? true : false}
        variant="subtitle1"
      >
        {user.user}
      </CustomTypography>
      <StatusCircle online={user.status === "online" ? true : false} />
    </div>
  );
};
