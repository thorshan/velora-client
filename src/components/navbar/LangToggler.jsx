import React, { useState } from "react";
import { Menu, MenuItem, Button, ListItemIcon, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../../contexts/LanguageContext";

// Language options
const LANGUAGES = [
  { code: "en", label: "En"},
  { code: "my", label: "Mm"},
  { code: "jp", label: "Jp"},
  // Add more languages here
];

const LanguageToggler = () => {
  const { language, toggleLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (lang) => {
    toggleLanguage(lang);
    handleClose();
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      <Tooltip title="Change Language">
        <Button startIcon={<LanguageIcon color="secondary" />} onClick={handleClick} color="secondary">
          {currentLang.label}
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={lang.code === language}
            onClick={() => handleSelect(lang.code)}
          >
            <ListItemIcon>
              <span>{lang.label}</span>
            </ListItemIcon>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageToggler;
