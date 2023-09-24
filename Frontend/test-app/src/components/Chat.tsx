import Cookies from "js-cookie";

export const Chat = () => {
  return (
    <div>
      <h1>{`Welcome ${Cookies.get(`userName`)}`}</h1>
    </div>
  );
};
