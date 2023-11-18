import React, { useEffect, useState } from "react";

import { Button } from "@mui/material";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import api from "../utils/axios";
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
    const fetchUser = async () => {
      const userName = Cookies.get("userName");
      if (userName) {
        try {
          const user = await api.get(`/user/${userName}`);
          user.data.status === "success" && navigate("/chat");
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUser();
  });

  const handleClick = async () => {
    try {
      const user = await api.get(`/user/${userName}`);
      if (user.data.status === "success") {
        alert("username already taken. Please input a new name");
      } else {
        try {
          await api.post("/user/signup", {
            user_id: userName,
            user_name: userName,
          });
          Cookies.set("userName", userName, { expires: 7 });
          navigate("/chat");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
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
          setUserName(e.target.value);
        }}
      />
      <Button variant="contained" onClick={handleClick}>
        Start
      </Button>
    </InputWrapper>
  );
};
