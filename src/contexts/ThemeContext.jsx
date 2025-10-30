import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/noto-sans-jp";

// Create context
const ColorModeContext = createContext();

// Hook to use the theme mode context
export const useColorMode = () => useContext(ColorModeContext);

// Provider
export const ColorModeProvider = ({ children }) => {
  // Load saved mode from localStorage (default to 'light')P
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Toggle between light/dark
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Define theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // 'light' or 'dark'

          primary:
            mode === "light"
              ? {
                  main: "#f4501e",
                }
              : {
                  main: "#ff6f43",
                },
          secondary:
            mode === "light"
              ? {
                  main: "#8d24aa",
                }
              : {
                  main: "#ba68c8",
                },
          background:
            mode === "light"
              ? {
                  default: "#fafafa",
                  paper: "#ffffff",
                }
              : {
                  default: "#121212",
                  paper: "#1e1e1e",
                },

          text:
            mode === "light"
              ? {
                  primary: "#212121",
                }
                : {
                  primary: "#eceff1",
                },
        },
        typography: {
          fontFamily: '"Noto Sans JP", "Roboto", "Arial", sans-serif',
          h1: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          h2: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif',textTransform: "none", },
          h3: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          h4: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          h5: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          h6: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          button: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          body1: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          body2: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          subtitle1: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          subtitle2: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
          caption: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif', textTransform: "none", },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none", 
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none", 
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
