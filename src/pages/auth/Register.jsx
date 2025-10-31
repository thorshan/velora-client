import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/loading/Loading";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import AlertModal from "../../components/alert/AlertModal";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Register = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  DocumentTitle(translations[language].regiser)

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = { name, email, password };
      await register(data);
      navigate("/");
    } catch (err) {
      console.error("Register error", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Register failed. Please try again";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <>
      {/* Loadig Component */}
      <Loading loading={loading} />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {translations[language].register}
            </Typography>
            {error && <AlertModal msg={error} />}

            <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
              <TextField
                type="text"
                label={translations[language].name}
                required
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                type="email"
                label={translations[language].email}
                autoFocus
                required
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                type="password"
                label={translations[language].password}
                required
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {translations[language].register}
              </Button>
              <Box sx={{ mt: 3 }}>
                <Typography component="p">
                  {translations[language].already_user}
                  <Button href="/login">{translations[language].login}</Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Register;
