import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Button,
  CardActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { itemApi } from "../../api/itemApi";
import { reviewApi } from "../../api/reviewApi";
import { cartApi } from "../../api/cartApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { useParams, Link } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import NavBar from "../../components/navbar/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { Home, Inventory, Store } from "@mui/icons-material";
import BreadCrumbs from "../../components/breadcrumbs/BreadCrumbs";
import { promotionApi } from "../../api/promotionApi";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const ItemDetail = () => {
  const { language } = useLanguage();
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const [resItem, resReview, resPromo] = await Promise.all([
          itemApi.getItem(id),
          reviewApi.getReviewByItem(id),
          promotionApi.getPromotionByItem(id),
        ]);

        setItem(resItem.data);
        setReviews(Array.isArray(resReview.data) ? resReview.data : []);
        const promoData = Array.isArray(resPromo.data) ? resPromo.data[0] : resPromo.data;
        setPromotion(promoData || null);

      } catch (err) {
        console.error("Error fetching item details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  const pageTitle = item ? item.name : 'Loading...';
  DocumentTitle(pageTitle);

  const addToCart = useCallback(async () => {
    if (!user || !item) return;
    try {
      const data = { userId: user.id, itemId: item._id, quantity: 1 };
      await cartApi.addToCart(data);
      setCount(prev => prev + 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }, [user, item]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar count={count} />
      <Box p={3}>
        <BreadCrumbs
          items={[
            { icon: <Home />, path: "/", name: "Home" },
            { icon: <Store />, path: "/shop", name: "Shop" },
            {
              icon: <Inventory />,
              path: window.location.href,
              name: item?.name,
            },
          ]}
        />
      </Box>
      {!loading && item ? (
        <Card
          sx={{ display: "flex", flexDirection: "column", boxShadow: "none" }}
        >
          <CardMedia
            component="img"
            image={item.image || "/images/no-image.jpg"}
            alt={item.name}
            sx={{ height: 200, objectFit: "cover" }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {item.brand?.name} {" ・ "} {item.category?.name}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {promotion ? (
                <>
                  <Typography
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }}
                  >
                    {translations[language].mmk} {" ・ "}
                    {item.price.toLocaleString()}
                  </Typography>
                  <Typography color="error.main" sx={{ fontWeight: "bold" }}>
                    {translations[language].mmk} {" ・ "}
                    {(
                      item.price -
                      (item.price * promotion.discount) / 100
                    ).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography color="primary" sx={{ fontWeight: "bold" }}>
                  {translations[language].mmk} {" ・ "}
                  {item.price.toLocaleString()}
                </Typography>
              )}
            </Box>
            <Typography fontWeight={"bold"} sx={{ mt: 2 }} variant="h5">
              {translations[language].description}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body1">
              {item.description}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="subtitle1">
              {translations[language].reviews}
            </Typography>
            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {translations[language].no_reviews || "No reviews yet."}
              </Typography>
            ) : (
              reviews.map((review) => (
                <React.Fragment key={review._id}>
                  <Typography sx={{ mt: 2 }} variant="subtitle1">
                    <q>{review.reviewText}</q> -{" "}
                    {review.user?.name || "Anonymous"}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Rating
                      name="half-rating-read"
                      value={review.reviewRating}
                      readOnly
                      size="small"
                    />
                  </Box>
                </React.Fragment>
              ))
            )}
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="secondary"
              size="small"
            >
              {translations[language].go_back}
            </Button>
            <Button
              component={Link}
              to={`/${item._id}/write-review`}
              variant="contained"
              color="success"
              size="small"
            >
              {translations[language].write_review}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={addToCart}
            >
              {translations[language].atc}
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Loading loading={loading} />
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {translations[language].atc_alert}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemDetail;
