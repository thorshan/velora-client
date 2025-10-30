import { Stack, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Stack
        direction="row"
        mt={2}
        justifyContent="center"
        alignItems={"center"}
      >
      <Typography sx={{ p: 2 }} variant="caption">
        &copy; {new Date().getFullYear()} velora
      </Typography>
    </Stack>
  );
};

export default Footer;
