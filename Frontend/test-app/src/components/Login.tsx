import React, { useEffect, useState } from "react";
import {
  createUser,
  getUserDetails,
  setUserStatusToOnline,
} from "../utils/api";

import { Button } from "@mui/material";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 20px;
`;

export const Login = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const userFromCookies = Cookies.get("userName");
    if (userFromCookies) {
      const checkUser = async () => {
        const user = await getUserDetails(userFromCookies);
        if (user.data.data !== null) {
          if (user?.data.data.online) {
            alert("sorry user already online");
          } else {
            const user = await setUserStatusToOnline(userFromCookies);
            user.data.online && navigate("/chat");
          }
        }
      };

      checkUser();
    }
  }, [navigate]);

  const setUpCookiesAndOnlineStatus = async () => {
    Cookies.set("userName", userName, { expires: 7 });
    const user = await setUserStatusToOnline(userName);
    user.data.online && navigate("/chat");
  };

  const handleClick = async () => {
    const user = await getUserDetails(userName);

    if (user.data.data) {
      if (user.data.data.online) {
        alert("sorry user already online");
      } else {
        setUpCookiesAndOnlineStatus();
      }
    } else {
      await createUser(userName);
      setUpCookiesAndOnlineStatus();
    }
  };

  return (
    <InputWrapper>
      <TextField
        required
        id="outlined-required"
        label="User Name"
        onChange={(e) => {
          setUserName(e.target.value.toLowerCase());
        }}
      />
      <Button variant="contained" onClick={handleClick}>
        Start
      </Button>
    </InputWrapper>
  );
};
