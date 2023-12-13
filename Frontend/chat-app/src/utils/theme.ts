import { Palette, PaletteColor } from "@mui/material";

import { createTheme } from "@mui/material";

interface CustomPaletteColor extends PaletteColor {
  sendMessageBubble: string;
  recieveMessageBubble: string;
}

export interface CustomPalette extends Palette {
  primary: PaletteColor;
  secondary: PaletteColor;
  bright: PaletteColor;
  chatBubble: CustomPaletteColor;
  border: PaletteColor;
}

const theme = createTheme({
  palette: {
    primary: {
      light: "#202c33",
      main: "#008892",
      dark: "#0c1317",
    },
    secondary: {
      light: "#008892",
      dark: "",
      main: "#005a61",
    },
    bright: {
      main: "#ffff",
      light: "#ffffffc3",
    },
    chatBubble: {
      sendMessageBubble: "#202c33ce",
      recieveMessageBubble: "green",
    },
    border: {
      main: "#ffffff24",
    },
  } as CustomPalette,
});

export default theme;
