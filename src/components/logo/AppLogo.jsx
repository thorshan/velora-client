import React from "react";
import { useTheme } from "@mui/material/styles"; 
import { Box } from "@mui/material"; 

const LOGO_LIGHT = "/images/logo.png";
const LOGO_DARK = "/images/logo-white.png";

export function AppLogo(props) {
  const theme = useTheme(); 

  const logoPath = 
    theme.palette.mode === "dark" 
      ? LOGO_DARK
      : LOGO_LIGHT;

  return (
    <Box {...props}> 
      <img 
        src={logoPath} 
        alt="Company Logo" 
        style={{ width: "90px", display: 'block' }} 
      />
    </Box>
  );
}