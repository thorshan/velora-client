import React from "react";
import { Box, Typography, Toolbar, AppBar, Avatar, IconButton } from "@mui/material";
import { Diversity2TwoTone as Logo, Brightness7, Brightness4,  } from "@mui/icons-material";
import LanguageToggler from "../../components/navbar/LangToggler";
import { useColorMode } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@mui/material/styles";

const AppBarTop = () => {
  const { user } = useAuth();
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{ bgcolor: "inherit", zIndex: (t) => t.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / App Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Logo color="primary" sx={{ mr: 1 }} />
          <Typography color="primary" variant="h6" component="div">
            Velora
          </Typography>
        </Box>

        {/* Language Toggler */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <LanguageToggler />
            {/* Dark Mode Toggle */}
            <IconButton onClick={toggleColorMode} color="primary">
              {theme.palette.mode === "dark" ? (
                <Brightness7 />
              ) : (
                <Brightness4 />
              )}
            </IconButton>
          </Box>
          <Avatar
            alt="User"
            src={null}
            sx={{
              bgcolor: "primary.main",
              color: "primary",
              width: 36,
              height: 36,
            }}
          >
            {user.name[0].toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarTop;
