import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const useCheckLogin = () => {
  const [user, setUser] = useState<string | undefined>();

  const navigate = useNavigate();
  useEffect(() => {
    const getUserFromCookies = async () => {
      const userName = await Cookies.get("userName");
      if (userName) {
        setUser(userName);
      }
      getUserFromCookies();
    };
  }, []);

  if (!user) navigate("/");
};
