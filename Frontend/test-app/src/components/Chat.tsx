import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("userName")) {
      console.log("I am here");
      navigate("/");
    }
  });

  return <>hello</>;
};
