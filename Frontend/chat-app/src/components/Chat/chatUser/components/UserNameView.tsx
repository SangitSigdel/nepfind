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
        unreadmessages={user.unreadMsgs > 0}
        variant="subtitle1"
      >
        {user.user}
      </CustomTypography>
      <StatusCircle
        data-testid="statusCircle"
        online={user.status === "online"}
      />
    </div>
  );
};
