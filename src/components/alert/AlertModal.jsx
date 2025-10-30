import React, { useState } from "react";
import { Modal, Box, Alert, Button } from "@mui/material";

const AlertModal = ({ msg, type }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-modal"
      aria-describedby="alert-modal-description"
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          width: { xs: "90%", sm: "50%", md: "40%" },
          textAlign: "center",
        }}
      >
        <Alert severity={type} sx={{ mb: 2, fontSize: "1.1rem" }}>
          {msg}
        </Alert>
        <Button variant="contained" onClick={handleClose}>
          Dismiss
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
