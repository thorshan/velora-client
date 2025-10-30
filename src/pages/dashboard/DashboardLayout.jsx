import React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppBarTop from "../../components/navbar/AppBarTop";
import SideBar from "../../components/sidebar/SideBar";
import Footer from "../../components/footer/Footer";

export default function DashboardLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <AppBarTop />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/*  Nested routes will render here */}
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
}
