import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";

const Forbidden = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "6rem", md: "10rem" },
          fontWeight: "bold",
          color: "error.main",
          lineHeight: 1,
        }}
      >
        403
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        {translations[language]._403sub}
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        {translations[language].no_permission}
      </Typography>

      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={() => navigate(-1)}
      >
        {translations[language].go_back}
      </Button>

      <Button variant="text" sx={{ mt: 2 }} onClick={() => navigate("/")}>
        {translations[language].go_back_home}
      </Button>
    </Container>
  );
};

export default Forbidden;
