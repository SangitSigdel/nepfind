import { ChatMessagesType, CurrentChatWithType } from "../components";

import { ChatUsersType } from "../components/Chat/ChatUsers";
import Cookies from "js-cookie";
import api from "../utils/api";
import { useReducer } from "react";

export enum reducerTypes {
  initilizeChatForCurrentUser = "initilizeChatForCurrentChatUser",
  setChatMessages = "setChatMessages",
  setChatUsers = "setChatUsers",
  setCurrentChatWith = "setCurrentChatWith",
  socketPrivateMessage = "socketPrivateMessage",
}

type reducerStateType = {
  chatMessages: ChatMessagesType[];
  chatUsers: ChatUsersType[];
  currentChatWith: CurrentChatWithType;
};

const initialState: reducerStateType = {
  chatMessages: [],
  chatUsers: [],
  currentChatWith: {
    username: "",
    userID: "",
  },
};

export const useChatReducer = () => {
  const reducer = (
    state: reducerStateType,
    action: { type: string; payload: any }
  ) => {
    const userName = Cookies.get("userName");
    switch (action.type) {
      case "socketPrivateMessage":
        api
          .get(`/chat/${action.payload}`, {
            params: {
              chatUserId: state.currentChatWith?.username,
            },
          })
          .then((res) => {
            dispatch({
              type: reducerTypes.setChatMessages,
              payload: res.data.messages.chats,
            });
          })
          .catch((err) => console.log(err));
        return state;

      case "initilizeChatForCurrentChatUser":
        api
          .get(
            `/chat/${userName}?chatUserId=${state.currentChatWith?.username}`
          )
          .then((res) => {
            console.log("the current chat with is", state.currentChatWith);

            dispatch({
              type: "setChatMessages",
              payload: res.data.messages.chats,
            });
          })
          .catch((err) => console.log(err));
        return state;

      case "setChatMessages":
        return { ...state, chatMessages: action.payload };

      case "setChatUsers":
        return { ...state, chatUsers: action.payload };

      case "setCurrentChatWith":
        return { ...state, currentChatWith: action.payload };
      default:
        throw new Error("sorry the requested action type was not found");
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};
