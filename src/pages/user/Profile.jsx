import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import NavBar from "../../components/navbar/NavBar";
import {
  ExpandLess,
  ExpandMore,
  Home,
  Person,
  Store,
} from "@mui/icons-material";
import { reviewApi } from "../../api/reviewApi";
import { orderApi } from "../../api/orderApi";
import Loading from "../../components/loading/Loading";
import BreadCrumbs from "../../components/breadcrumbs/BreadCrumbs";

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  // const [open, setOpen] = useState(true);
  const [openItems, setOpenItems] = useState({});
  const userId = user?.id;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await reviewApi.getReviewByUser(userId);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getOrderByUser(userId);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    fetchOrders();
  }, [userId]);

  const handleClick = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <NavBar />
      <Box p={3}>
        {user && (
          <Box>
            <BreadCrumbs
              items={[
                { icon: <Home />, path: "/", name: "Home" },
                { icon: <Store />, path: "/shop", name: "Shop" },
                {
                  icon: <Person />,
                  path: window.location.href,
                  name: "Profile",
                },
              ]}
            />
            <Typography sx={{ mt: 2 }} variant="h4" color="primary">
              {translations[language].profile}
            </Typography>
            <Stack direction={"column"} spacing={3} marginY={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={user.name || "User"}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 50,
                    height: 50,
                    fontWeight: "bold",
                  }}
                />
                <Typography variant="h6" sx={{ marginLeft: 3 }}>
                  {user?.name}
                </Typography>
              </Box>
              <Typography variant="caption">
                {translations[language].email} {" ・ "} {user?.email}
              </Typography>
              <Typography color="primary">
                {translations[language].role} {" ・ "} {user?.role}
              </Typography>
            </Stack>

            {/* Orders */}
            <Typography variant="tilte1" color="primary">
              {translations[language].order_no}
            </Typography>
            <Box my={3}>
              {orders.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {translations[language].no_orders}
                </Typography>
              ) : (
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      {translations[language].orders}
                    </ListSubheader>
                  }
                >
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <ListItemButton onClick={() => handleClick(order._id)}>
                        <ListItemText primary={order.orderNumber} />
                        {openItems[order._id] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>

                      <Collapse
                        in={openItems[order._id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" sx={{ p: 2 }}>
                          <ListItemText
                            primary={`Status: ${order.orderStatus}`}
                            sx={{ mb: 1 }}
                          />
                          <ListItemButton sx={{ color: "error" }}>
                            {translations[language].delete}
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>

            {/* Reviews */}
            <Typography variant="tilte1" color="primary">
              {translations[language].reviews}
            </Typography>
            <Box my={3}>
              {reviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {translations[language].no_reviews || "No reviews yet."}
                </Typography>
              ) : (
                reviews.map((review) => (
                  <React.Fragment key={review._id}>
                    <Typography sx={{ mt: 2 }} variant="subtitle1">
                      <q>{review.reviewText}</q> -{" "}
                      {review.user?.name || "Anonymous"} 「{" "}
                      {review.user?.email || ""} 」
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
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Profile;
