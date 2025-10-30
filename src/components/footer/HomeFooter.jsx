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
            <Typography variant='h4' color='text.primary'>{translations[language].logo || "Velora"}</Typography>
        </Box>
        <Box>
            <Stack direction={"row"} spacing={3}>
                <Link variant='caption' href="/about" color="text.primary" underline="none">{translations[language].about}</Link>
                <Link variant='caption' href="/contact" color="text.primary" underline="none">{translations[language].contact}</Link>
                <Link variant='caption' href="/terms-and-conditions" color="text.primary" underline="none">{translations[language].terms}</Link>
                <Link variant='caption' href="/policy" color="text.primary" underline="none">{translations[language].policy}</Link>
            </Stack>
            <Typography variant='caption' color='text.primary' marginTop={3}>&copy; {new Date().getFullYear()} velora. All rights reserved.</Typography>
        </Box>
        <Box>
            <Stack direction={"row"} spacing={3}>
                <Link href="https://t.me/veloraecommerce" color="text.primary"><Telegram /></Link>
                <Link href="https://facebook.com/veloraecommerce" color="text.primary"><Facebook /></Link>
                <Link href="https://facebook.com/veloraecommerce" color="text.primary"><Instagram /></Link>
                <Link href="https://whatsapp.com/veloraecommerce" color="text.primary"><WhatsApp /></Link>
            </Stack>
            <Typography variant='caption' color='text.primary' marginTop={3}>{translations[language].support} ・ <Link href="#" color="text.primary">support@velora.com</Link></Typography>
        </Box>
    </Box>
  )
}

export default HomeFooter