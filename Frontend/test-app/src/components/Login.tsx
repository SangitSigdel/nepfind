import React, { useEffect, useState } from "react";
import api, { getUserDetails } from "../utils/api";

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
    const userName = Cookies.get("userName");
    if (userName) {
      const checkUser = async () => {
        try {
          const user = await getUserDetails();
          if (user.data.data.online) {
            alert("sorry user already online");
          } else {
            const user = await api.patch(`/user/status/${userName}`);
            user && navigate("/chat");
          }
        } catch (error) {
          console.log(error);
        }
      };
      // isuserOnline
      checkUser();
    }
  }, [navigate]);

  const handleClick = async () => {
    try {
      const user: { data: { data: { online: boolean } } } = await api.get(
        `/user/${userName}`
      );

      if (user.data.data.online) {
        alert("sorry user already online");
      } else {
        Cookies.set("userName", userName, { expires: 7 });
        await api.patch(`/user/status/${userName}`);
        navigate("/chat");
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        try {
          await api.post("/user/signup", {
            user_id: userName,
            user_name: userName,
          });
          await api.patch(`/user/status/${userName}`);
          Cookies.set("userName", userName, { expires: 7 });
          navigate("/chat");
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
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
