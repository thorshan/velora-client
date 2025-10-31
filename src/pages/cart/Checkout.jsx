import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import { promotionApi } from "../../api/promotionApi";
import { orderApi } from "../../api/orderApi";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import dayjs from "dayjs";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Checkout = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [promotion, setPromotion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const userId = user?.id;
  const generatedOrderNumber = () => {
    const date = dayjs().format("YYYYMMDD");
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${date}#${random}`;
  };
  const [formData, setFormData] = useState(null);

  DocumentTitle(translations[language].checkout)

  const calculateItemPrices = (cartItem) => {
    const promotionsArray = promotion[String(cartItem.item?._id)];
    const promo = promotionsArray?.[0];
    const originalPrice = cartItem.item?.price || 0;
    const hasPromo = !!promo?.discount;

    // Calculate discounted price
    const discountedPrice = hasPromo
      ? originalPrice - (originalPrice * promo.discount) / 100
      : originalPrice;

    const totalPrice = discountedPrice * cartItem.quantity;

    return { originalPrice, discountedPrice, totalPrice, hasPromo, promo };
  };

  // --- Initial Cart Fetch Effect ---
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await cartApi.getCart(userId);
        const cartData = res.data || null;
        setCart(cartData);
        if (cartData) {
          setFormData({
            user: userId,
            cart: cartData._id,
            deliAddress: "",
            deliContact: "",
            orderNumber: generatedOrderNumber(),
          });
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  // --- Promotions Fetch Effect ---
  useEffect(() => {
    if (!cart?.items?.length) {
      setPromotion({});
      return;
    }

    const fetchPromotions = async () => {
      try {
        const promoMap = {};

        await Promise.all(
          cart.items.map(async (cartItem) => {
            const itemId = cartItem.item?._id;
            if (!itemId) return;

            try {
              const resPromo = await promotionApi.getPromotionByItem(itemId);
              if (resPromo?.data) {
                promoMap[String(itemId)] = resPromo.data;
              }
            } catch (err) {
              console.warn(`Failed to fetch promotion for item ${itemId}`, err);
            }
          })
        );
        setPromotion(promoMap);
      } catch (err) {
        console.error("Failed to fetch promotions", err);
      }
    };

    fetchPromotions();
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await orderApi.createOrder(formData);
    await cartApi.clearCart(userId);
    setOpen(true);
    navigate('/shop');
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  if (loading) return <Loading loading={loading} />;

  if (error)
    return (
      <Typography color="error" align="center" mt={6}>
        {error}
      </Typography>
    );

  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6">{translations[language].no_data}</Typography>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: "auto", p: 3 }}>
      <Paper sx={{ width: "80%", height: "100%", p: 3 }}>
        <Typography variant="h4" color="primary" fontWeight={700} mb={3}>
          {translations[language].your_order}
        </Typography>

        <Stack spacing={3}>
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{translations[language]._no}</TableCell>
                <TableCell>{translations[language].name}</TableCell>
                <TableCell align="right">
                  {translations[language].counting}
                </TableCell>
                <TableCell align="right">
                  {translations[language].price}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((cartItem, index) => {
                const {
                  originalPrice,
                  discountedPrice,
                  hasPromo,
                } = calculateItemPrices(cartItem);

                if (!cartItem.item) return null;

                return (
                  <TableRow key={cartItem.item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{cartItem.item.name}</TableCell>
                    <TableCell align="right">{cartItem.quantity}</TableCell>
                    {hasPromo ? (
                      <TableCell align="right">
                        {discountedPrice} {translations[language].mmk}
                      </TableCell>
                    ) : (
                      <TableCell align="right">
                        {originalPrice} {translations[language].mmk}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Stack>

        <Divider sx={{ my: 2 }} />
        {/* User Info */}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" mb={2}>
            {translations[language].contact_info}
          </Typography>
          <TextField fullWidth value={user?.name} disabled sx={{ mb: 2 }} />
          <TextField
          fullWidth
            id="outlined-start-adornment"
            sx={{ mb: 2 }}
            value={formData.deliContact}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">09</InputAdornment>
                ),
              },
            }}
            onChange={(e) =>
              setFormData({ ...formData, deliContact: e.target.value })
            }
            required
          />
          <TextField
            fullWidth
            multiline
            placeholder={translations[language].address}
            value={formData.deliAddress}
            onChange={(e) =>
              setFormData({ ...formData, deliAddress: e.target.value })
            }
            required
          />

          <Divider sx={{ my: 2 }} />

          {/* --- Grand Total Section --- */}
          <Card sx={{ boxShadow: 0 }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="primary" fontWeight={600}>
                {translations[language].grand_total}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {cart.items.reduce((total, cartItem) => {
                  const { totalPrice } = calculateItemPrices(cartItem);
                  return total + totalPrice;
                }, 0)}{" "}
                {translations[language].mmk}
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          {/* Footer Section */}

          <Stack textAlign="right" direction={"row"} spacing={3} marginY={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={async () => await cartApi.clearCart(userId)}
              component={Link}
              to={`/${userId}/cart`}
            >
              {translations[language].go_back}
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
              type="submit"
            >
              {translations[language].place_order}
            </Button>
          </Stack>
        </Box>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {translations[language].order_placed}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Checkout;
