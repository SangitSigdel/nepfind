import React, { useEffect, useState } from "react";

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
    if (Cookies.get("userName")) {
      navigate("/chat");
    }
  });

  const handleClick = () => {
    Cookies.set("userName", userName, { expires: 7 });
    navigate("/chat");
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
