import Cookies from "js-cookie";

export const Chat = () => {
  return <>{`hello ${Cookies.get("userName")} from chat page`}</>;
};
