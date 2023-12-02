import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat, Login } from "./components";

import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
import theme from "./utils/theme";
import { title } from "./utils/constants";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
