import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';
import { Box, Typography, Stack, Link } from '@mui/material';
import { Telegram, Facebook, Instagram, WhatsApp } from '@mui/icons-material';

const HomeFooter = () => {
    const { language } = useLanguage();
  return (
    <Box bgcolor={"primary.main"} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", p: 3 }}>
        <Box>
            <Typography variant='h4' color='#eceff1'>{translations[language].logo || "Velora"}</Typography>
        </Box>
        <Box>
            <Stack direction={"row"} spacing={3}>
                <Link variant='caption' href="/about" color="#eceff1" underline="none">{translations[language].about}</Link>
                <Link variant='caption' href="/contact" color="#eceff1" underline="none">{translations[language].contact}</Link>
                <Link variant='caption' href="/terms-and-conditions" color="#eceff1" underline="none">{translations[language].terms}</Link>
                <Link variant='caption' href="/policy" color="#eceff1" underline="none">{translations[language].policy}</Link>
            </Stack>
            <Typography variant='caption' color='#eceff1' marginTop={3}>&copy; {new Date().getFullYear()} velora. All rights reserved.</Typography>
        </Box>
        <Box>
            <Stack direction={"row"} spacing={3}>
                <Link href="https://t.me/veloraecommerce" color="#eceff1"><Telegram /></Link>
                <Link href="https://facebook.com/veloraecommerce" color="#eceff1"><Facebook /></Link>
                <Link href="https://facebook.com/veloraecommerce" color="#eceff1"><Instagram /></Link>
                <Link href="https://whatsapp.com/veloraecommerce" color="#eceff1"><WhatsApp /></Link>
            </Stack>
            <Typography variant='caption' color='#eceff1' marginTop={3}>{translations[language].support} ・ <Link href="#" color="#eceff1">support@velora.com</Link></Typography>
        </Box>
    </Box>
  )
}

export default HomeFooter