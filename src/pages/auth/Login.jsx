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
  Alert,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/loading/Loading";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import AlertModal from "../../components/alert/AlertModal";

const Login = () => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      setMessage("Authentication success!");
      navigate("/");
    } catch (err) {
      console.error("Login error", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again";
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
        {message && (
          <AlertModal msg={message} type={"success"} />
        )}
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
              {translations[language].login}
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
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
                {translations[language].login}
              </Button>
              <Box sx={{ mt: 3 }}>
                <Typography component="p">
                  {translations[language].create}
                  <Button href="/register">
                    {translations[language].account}
                  </Button>
                  ?
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
