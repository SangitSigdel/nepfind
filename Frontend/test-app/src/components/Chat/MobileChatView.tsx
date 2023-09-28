import { Box, Container, IconButton } from "@mui/material";

import { ChatScreen } from "./ChatScreen";
import { ChatScreenProps } from "./ChatScreen";
import { ChatUsers } from "./ChatUsers";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export const MobileChatView = ({
  chatMessages,
  setChatMessages,
}: ChatScreenProps) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  return (
    <Container fixed>
      {!drawerOpen ? (
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      ) : (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ width: "100%" }}
        >
          <ChatUsers />
        </Drawer>
      )}
      <Box
        component="div"
        sx={{
          position: "absolute",
          bottom: "0",
          width: "90%",
        }}
      >
        <ChatScreen
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      </Box>
    </Container>
  );
};
