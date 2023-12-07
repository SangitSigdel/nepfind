import Cookies from "js-cookie";
import React from "react";
import { getUserDetails } from "../../../../utils/api";

export const AllChatUsersList = async () => {
  const loggedInUser = Cookies.get("userName") as string;

  const userData = await getUserDetails(loggedInUser);
  return <div>AllChatUsersList</div>;
};
