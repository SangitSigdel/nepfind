import { Button } from "@mui/material";
import React from "react";
import TextField from "@mui/material/TextField";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 20px;
`;

function App() {
  return (
    <InputWrapper>
      <TextField required id="outlined-required" label="User Name" />
      <Button variant="contained">Start</Button>
    </InputWrapper>
  );
}

export default App;
