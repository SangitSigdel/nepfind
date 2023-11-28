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
    const loggedInUserName = Cookies.get("userName");
    if (loggedInUserName) {
      const checkUser = async () => {
        const user = await getUserDetails(loggedInUserName);

        if (user.data.data.online) {
          alert("sorry user already online");
        } else {
          const user = await setUserStatusToOnline(loggedInUserName);
          user.data.online && navigate("/chat");
        }
      };

      checkUser();
    }
  }, [navigate]);

  const handleClick = async () => {
    const user = await getUserDetails(userName);

    if (user.data.data) {
      if (user.data.data.online) {
        alert("sorry user already online");
      } else {
        Cookies.set("userName", userName, { expires: 7 });
        const user = await setUserStatusToOnline(userName);
        user.data.online && navigate("/chat");
      }
    } else {
      await createUser(userName);
      Cookies.set("userName", userName, { expires: 7 });
      const user = await setUserStatusToOnline(userName);
      user.data.online && navigate("/chat");
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
