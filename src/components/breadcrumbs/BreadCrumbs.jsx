import { Breadcrumbs, Button, Paper } from "@mui/material";
import React from "react";

const BreadCrumbs = ({ items }) => {
  return (
    <Paper sx={{ p: 1 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => (
          <Button
            key={index}
            startIcon={item.icon}
            href={item.path}
            sx={{ textTransform: "none" }}
          >
            {item.name}
          </Button>
        ))}
      </Breadcrumbs>
    </Paper>
  );
};

export default BreadCrumbs;
