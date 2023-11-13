import { Dispatch, SetStateAction } from "react";

import { CurrentChatWithType } from "./index";
import styled from "styled-components";

const SelectUserWrapper = styled.div`
  padding-right: 20px;
  p {
    font-size: 18px;
    margin: 0.2em;
  }

  background-color: #3f0e40;
  color: #ffff;
  padding-top: 20px;
  height: calc(100vh - 20px);
  padding-left: 2em;
`;

export type ChatUsersType = {
  user: string;
  status: string;
  userId: string;
};

type ChatUsersProps = {
  users: ChatUsersType[];
  setCurrentChatWith: Dispatch<
    React.SetStateAction<CurrentChatWithType | undefined>
  >;
  currentChatWith?: CurrentChatWithType;
};

export const ChatUsers = ({ users, setCurrentChatWith }: ChatUsersProps) => {
  return (
    <SelectUserWrapper>
      {users.map((el, index) => (
        <div
          key={index}
          style={{ cursor: "pointer" }}
          onClick={() =>
            setCurrentChatWith({ username: el.user, userID: el.userId })
          }
        >
          <p>{el.user}</p>
          <p style={{ color: "#d1d1d1", marginBottom: "20px" }}>{el.status}</p>
        </div>
      ))}
    </SelectUserWrapper>
  );
};
