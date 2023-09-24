import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat, Login } from "./components";

import { Helmet } from "react-helmet";
import { title } from "./utils/constants";

export const App = () => {
  return (
    <BrowserRouter>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
