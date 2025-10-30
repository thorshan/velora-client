import React from "react";
import { Box, CardMedia, Typography, Card } from "@mui/material";
import NavBar from "../../components/navbar/NavBar";
import { translations } from "../../utils/translations";
import { useLanguage } from "../../contexts/LanguageContext";

const Contact = () => {
  const { language } = useLanguage();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Card>
          <CardMedia
            component="img"
            image={"/images/contact.jpg"}
            sx={{ height: 350, objectFit: "cover" }}
          />
        </Card>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="primary" marginY={3}>
          {translations[language].contact}
        </Typography>
        <Typography variant="body1" color="text.primary" marginY={3}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. In eligendi
          blanditiis sunt et optio ut facere perspiciatis modi ipsa dolores
          similique nihil harum repellendus illum ad autem pariatur, quaerat
          officiis aut? Corrupti nulla sapiente modi illo non quod numquam
          consequuntur nesciunt dolore est quisquam, facere cupiditate? Atque
          alias esse architecto delectus veritatis illo, rem dolorum quasi dolor
          aut libero ab eius incidunt vitae suscipit ipsam dolore ducimus?
          Eligendi asperiores nemo nam quae, sit, corrupti repellendus deleniti
          eius molestias, accusantium odio laudantium. Consectetur
          necessitatibus distinctio nisi unde? Dignissimos, quibusdam distinctio
          fugit aspernatur, iste incidunt beatae, ex dolorum facere
          necessitatibus recusandae earum.
        </Typography>
        <Typography variant="body1" color="text.primary" marginY={3}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. In eligendi
          blanditiis sunt et optio ut facere perspiciatis modi ipsa dolores
          similique nihil harum repellendus illum ad autem pariatur, quaerat
          officiis aut? Corrupti nulla sapiente modi illo non quod numquam
          consequuntur nesciunt dolore est quisquam, facere cupiditate? Atque
          alias esse architecto delectus veritatis illo, rem dolorum quasi dolor
          aut libero ab eius incidunt vitae suscipit ipsam dolore ducimus?
          Eligendi asperiores nemo nam quae, sit, corrupti repellendus deleniti
          eius molestias, accusantium odio laudantium. Consectetur
          necessitatibus distinctio nisi unde? Dignissimos, quibusdam distinctio
          fugit aspernatur, iste incidunt beatae, ex dolorum facere
          necessitatibus recusandae earum.
        </Typography>
        <Typography variant="body1" color="text.primary" marginY={3}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. In eligendi
          blanditiis sunt et optio ut facere perspiciatis modi ipsa dolores
          similique nihil harum repellendus illum ad autem pariatur, quaerat
          officiis aut? Corrupti nulla sapiente modi illo non quod numquam
          consequuntur nesciunt dolore est quisquam, facere cupiditate? Atque
          alias esse architecto delectus veritatis illo, rem dolorum quasi dolor
          aut libero ab eius incidunt vitae suscipit ipsam dolore ducimus?
          Eligendi asperiores nemo nam quae, sit, corrupti repellendus deleniti
          eius molestias, accusantium odio laudantium. Consectetur
          necessitatibus distinctio nisi unde? Dignissimos, quibusdam distinctio
          fugit aspernatur, iste incidunt beatae, ex dolorum facere
          necessitatibus recusandae earum.
        </Typography>
      </Box>
    </Box>
  );
};

export default Contact;
