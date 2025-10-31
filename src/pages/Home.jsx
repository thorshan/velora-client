import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Tabs,
  Tab,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import HomeFooter from "../components/footer/HomeFooter";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { itemApi } from "../api/itemApi";
import { reviewApi } from "../api/reviewApi";
import { tabsClasses } from "@mui/material/Tabs";
import Loading from "../components/loading/Loading";
import { DocumentTitle } from "../components/utils/DocumentTitle";

const Home = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState(0);
  DocumentTitle()

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const itemRes = await itemApi.getAllItems();
      const itemsData = itemRes.data;

      const [allReviews] = await Promise.all([
        Promise.all(
          itemsData.map((item) => reviewApi.getReviewByItem(item._id))
        ),
      ]);

      setItems(itemsData);
      setReviews(allReviews.flatMap((r) => r.data || []));
    } catch (err) {
      console.error(err);
      setMessage("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute average review
  const getAverageRating = (itemId) => {
    const itemReviews = reviews.filter(
      (r) => String(r.item?._id || r.item) === String(itemId)
    );
    if (itemReviews.length === 0) return 0;
    const sum = itemReviews.reduce((acc, r) => acc + r.reviewRating, 0);
    return Math.round((sum / itemReviews.length) * 2) / 2;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <NavBar />

      {/* Hero Image */}
      <Box sx={{ p: 3 }}>
        <Card>
          <CardMedia
            component="img"
            image={"/images/slide1.jpg"}
            sx={{ height: 350, objectFit: "cover" }}
          />
        </Card>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {loading ? (
          <Loading loading={loading} />
        ) : items.length > 0 ? (
          <>
            <Typography variant="h5" color="primary" marginBottom={5}>
              {translations[language].rec_added}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="items tabs"
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    "&.Mui-disabled": { opacity: 0.3 },
                  },
                  "& .MuiTabs-flexContainer": {
                    gap: 2,
                  },
                  px: 2,
                }}
              >
                {items.slice(0, 20).map((item) => {
                  const avgRating = getAverageRating(item._id);
                  const reviewCount = reviews.filter(
                    (r) => String(r.item?._id || r.item) === String(item._id)
                  ).length;

                  return (
                    <Tab
                      key={item._id}
                      disableFocusRipple
                      disableRipple
                      label={
                        <Card
                          sx={{
                            width: 220,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardActionArea
                            component={Link}
                            to={`/${item._id}/detail`}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={item.image || "/images/no-image.jpg"}
                              alt={item.name}
                              sx={{ height: 180, objectFit: "cover" }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                {item.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.brand?.name} {" ・ "}{" "}
                                {item.category?.name}
                              </Typography>
                              <Typography color="primary" sx={{ mt: 1 }}>
                                {item.price}{" "}{translations[language].mmk}
                              </Typography>

                              {avgRating > 0 ? (
                                <Box
                                  sx={{
                                    mt: 1,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Rating
                                    size="small"
                                    value={avgRating}
                                    precision={0.5}
                                    readOnly
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ ml: 0.5 }}
                                  >
                                    ({reviewCount})
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography variant="caption" sx={{ mt: 1 }}>
                                  {translations[language].no_review}
                                </Typography>
                              )}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      }
                      sx={{
                        p: 0,
                        minWidth: "auto",
                        "&.Mui-selected": { opacity: 1 },
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 5,
              }}
            >
              <Button
                fullWidth
                color="primary"
                variant="contained"
                href="/shop"
              >
                {translations[language].browse_all}
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 3, textAlign: "center" }}
          >
            {message || translations[language].no_data}
          </Typography>
        )}
      </Box>
      <HomeFooter />
    </Box>
  );
};

export default Home;
