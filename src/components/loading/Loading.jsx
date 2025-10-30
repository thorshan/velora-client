import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Loading = ({loading}) => {
  return (
    <Backdrop
      open={loading}
      sx={{ color: "primary.main", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
