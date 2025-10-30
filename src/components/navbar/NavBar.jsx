import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  useScrollTrigger,
  Badge,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  Menu as MenuIcon,
  Diversity2TwoTone as Logo,
  Logout,
  People,
  Dashboard,
  ShoppingCart,
} from "@mui/icons-material";
import LanguageToggler from "../../components/navbar/LangToggler";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { useColorMode } from "../../contexts/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ROLES } from "../../utils/constants";

function ElevationScroll({ ...props }) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const NavBar = ({ props, count }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();

  const navItems = [
    { label: translations[language].home, path: "/" },
    { label: translations[language].about, path: "/about" },
    { label: translations[language].contact, path: "/contact" },
  ];

  const settings = [
    {
      label: translations[language].profile,
      path: `/${user?.id}/profile`,
      icon: <People color="primary" />,
      roles: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
    },
    {
      label: translations[language].dashboard,
      path: "/auth/dashboard",
      icon: <Dashboard color="primary" />,
      roles: [ROLES.ADMIN, ROLES.MODERATOR],
    },
    {
      label: translations[language].logout,
      path: "/logout",
      icon: <Logout color="primary" />,
      roles: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
    },
  ];

  // Mobile Drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  // Account Menu
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Drawer content (for mobile)
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label}>
            <ListItemButton
              href={item.path}
              sx={{
                textAlign: "center",
                color: theme.palette.primary.main,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ElevationScroll {...props}>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left side: Logo + Menu icon */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Hamburger for mobile */}
            <IconButton
              color="primary"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <Logo
              color="primary"
              sx={{ mr: 1, display: { xs: "none", sm: "inline" } }}
            />
            <Typography variant="h6" component="div" color="primary">
              Velora
            </Typography>
          </Box>

          {/* Center: Nav links (hide on mobile) */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.path}
                sx={{ color: "primary", fontWeight: 500 }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Right side: Language + Auth */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LanguageToggler color="primary" />

              {/* Dark Mode Toggle */}
              <IconButton onClick={toggleColorMode} color="primary">
                {theme.palette.mode === "dark" ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </IconButton>
              <Badge badgeContent={count} color="secondary">
                <IconButton
                  component={Link}
                  to={`/${user?.id}/cart`}
                  color="primary"
                >
                  <ShoppingCart />
                </IconButton>
              </Badge>
            </Box>

            {!isAuthenticated ? (
              <Button
                size="small"
                href="/login"
                variant="contained"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {translations[language].login}
              </Button>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.name || "User"}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 36,
                        height: 36,
                        fontWeight: "bold",
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings
                    .filter((i) => i.roles.includes(user?.role))
                    .map((setting) => (
                      <MenuItem
                        key={setting.label}
                        onClick={handleCloseUserMenu}
                      >
                        <Button
                          startIcon={setting.icon}
                          component={
                            setting.path && setting.path !== "/logout"
                              ? Link
                              : "button"
                          }
                          to={
                            setting.path && setting.path !== "/logout"
                              ? setting.path
                              : undefined
                          }
                          onClick={
                            setting.path === "/logout" ? logout : undefined
                          }
                          sx={{
                            textTransform: "none",
                            color: "text.primary",
                            justifyContent: "flex-start",
                            mb: 0.5,
                          }}
                          fullWidth
                        >
                          {setting.label}
                        </Button>
                      </MenuItem>
                    ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // better performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </ElevationScroll>
  );
};

export default NavBar;
