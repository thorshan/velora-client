import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  Inventory as StorefrontIcon,
  Reviews as ReviewIcon,
  LocalActivity as ActivityIcon,
  DeliveryDining,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";

const drawerWidth = 250;

const SideBar = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  

  const menuItems = [
    {
      text: translations[language].dashboard,
      icon: <DashboardIcon />,
      path: "/auth/dashboard",
      roles: [ROLES.ADMIN, ROLES.MODERATOR],
    },
    {
      text: translations[language].users,
      icon: <PeopleIcon />,
      path: "/auth/users",
      roles: [ROLES.ADMIN],
    },
    {
      text: translations[language].brand,
      icon: <StoreIcon />,
      path: "/auth/brands",
      roles: [ROLES.ADMIN],
    },
    {
      text: translations[language].categories,
      icon: <CategoryIcon />,
      path: "/auth/categories",
      roles: [ROLES.ADMIN],
    },
    {
      text: translations[language].items,
      icon: <StorefrontIcon />,
      path: "/auth/items",
      roles: [ROLES.ADMIN, ROLES.MODERATOR],
    },
    {
      text: translations[language].reviews,
      icon: <ReviewIcon />,
      path: "/auth/reviews",
      roles: [ROLES.ADMIN, ROLES.MODERATOR],
    },
    {
      text: translations[language].promotions,
      icon: <ActivityIcon />,
      path: "/auth/promotions",
      roles: [ROLES.ADMIN],
    },
    {
      text: translations[language].orders,
      icon: <DeliveryDining />,
      path: "/auth/orders",
      roles: [ROLES.ADMIN, ROLES.MODERATOR],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
            {user.name[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="caption" color="primary">
            {translations[language].role} ・ {user.role.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Menu */}
        <List>
          {menuItems
            .filter((i) => i.roles.includes(user.role))
            .map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton href={item.path} sx={{ borderRadius: 1 }}>
                  <ListItemIcon sx={{ color: 'primary.main'}}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          variant="outlined"
          size="small"
          onClick={logout}
        >
          {translations[language].logout}
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideBar;
