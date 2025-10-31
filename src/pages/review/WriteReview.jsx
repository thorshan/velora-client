import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { itemApi } from "../../api/itemApi";
import { reviewApi } from "../../api/reviewApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/loading/Loading";
import NavBar from "../../components/navbar/NavBar";
import { translations } from "../../utils/translations";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const WriteReview = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  DocumentTitle(translations[language].write_review)
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    reviewText: "",
    reviewRating: 0,
    item: id,
    user: user.id,
  });

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await itemApi.getItem(id);
        setItem(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);


  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewApi.createReview(formData);
      setMessage("Review submitted successfully!");
      setFormData({
        title: "",
        reviewText: "",
        reviewRating: 0,
        item: id,
        user: user.id,
      });
    } catch (err) {
      console.error(err);
      setMessage("Error adding data: " + err.message);
    }
  };



  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      {!loading && item ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "none",
            p: 3,
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography variant="title1" gutterBottom>
            {translations[language].write_review} {" ・ "} {item?.name}
          </Typography>
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            rows={3}
            label={translations[language].title}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            multiline
            rows={3}
            label={translations[language]._onMind}
            value={formData.reviewText}
            onChange={(e) =>
              setFormData({ ...formData, reviewText: e.target.value })
            }
            required
          />
          <Typography component="legend">
            {translations[language].rating}
          </Typography>
          <Rating
            name="simple-controlled"
            value={formData.reviewRating}
            onChange={(e, newValue) =>
              setFormData({ ...formData, reviewRating: newValue })
            }
            required
          />
          <Stack direction={"row"} spacing={2} sx={{ mt: 3 }}>
            <Button href="/" variant="contained" color="secondary" size="small">
              {translations[language].go_back_home}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
            >
              {translations[language].submit}
            </Button>
          </Stack>
          {message && (
            <Typography color="success" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      ) : (
        <Loading loading={loading} />
      )}
    </Box>
  );
};

export default WriteReview;
