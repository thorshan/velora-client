import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";

const NotFound = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  // {translations[language].add_user}

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
        component="h1"
        sx={{
          fontSize: { xs: "6rem", md: "10rem" },
          fontWeight: "bold",
          color: "primary.main",
          lineHeight: 1,
        }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
      {translations[language]._404sub}
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
      {translations[language]._404txt}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/")}
      >
        {translations[language].go_back_home}
      </Button>
    </Container>
  );
};

export default NotFound;
