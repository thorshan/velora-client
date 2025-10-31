import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import { promotionApi } from "../../api/promotionApi";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Stack,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Loading from "../../components/loading/Loading";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Cart = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [promotion, setPromotion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  DocumentTitle(translations[language].your_cart)

  const userId = user?.id;

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
        setCart(res.data || null);
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

  // Update quantity
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (!userId) return;
    try {
      const res = await cartApi.updateQuantity({ userId, itemId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item
  const handleRemove = async (itemId) => {
    if (!userId) return;
    try {
      const res = await cartApi.removeFromCart({ userId, itemId });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Clear cart
  const handleClear = async () => {
    if (!userId) return;
    try {
      const res = await cartApi.clearCart(userId);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
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
        <ShoppingCartIcon sx={{ fontSize: 60, color: "grey.500" }} />
        <Typography variant="h5" fontWeight={600}>
          {translations[language].empty_cart}
        </Typography>
        <Typography color="text.secondary">
          {translations[language].add_item_cart}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          sx={{ mt: 5 }}
          component={Link}
          to="/shop"
        >
          {translations[language].browse_all}
        </Button>
      </Box>
    );

  return (
    <Box maxWidth="800px" mx="auto" mt={6} px={2}>
      <Typography variant="h4" color="primary" fontWeight={700} mb={3}>
        {translations[language].your_cart}
      </Typography>

      <Stack spacing={3}>
        {cart.items.map((cartItem) => {
          const {
            originalPrice,
            discountedPrice,
            totalPrice,
            hasPromo,
            promo,
          } = calculateItemPrices(cartItem);

          if (!cartItem.item) return null;

          return (
            <Card
              key={cartItem.item._id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Product Info */}
                <Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6">{cartItem.item.name}</Typography>

                    {hasPromo ? (
                      <>
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: "line-through" }}
                          color="text.secondary"
                        >
                          {originalPrice.toLocaleString()} {translations[language].mmk}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          {discountedPrice.toLocaleString()} {translations[language].mmk} (-
                          {promo.discount}%)
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="primary">
                        {originalPrice.toLocaleString()} {translations[language].mmk}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {translations[language].quantity} : {cartItem.quantity} {" "} {translations[language].counting}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translations[language].item_total_price} : {totalPrice.toLocaleString()} {" "}
                      {translations[language].mmk}
                    </Typography>
                  </CardContent>
                </Box>

                {/* Controls */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Tooltip title="Decrease quantity">
                      <IconButton
                        onClick={() =>
                          handleUpdateQuantity(
                            cartItem.item._id,
                            Math.max(1, cartItem.quantity - 1)
                          )
                        }
                        color="secondary"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>

                    <Typography>{cartItem.quantity}</Typography>

                    <Tooltip title="Increase quantity">
                      <IconButton
                        onClick={() =>
                          handleUpdateQuantity(
                            cartItem.item._id,
                            cartItem.quantity + 1
                          )
                        }
                        color="secondary"
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove item">
                      <IconButton
                        onClick={() => handleRemove(cartItem.item._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* --- Grand Total Section --- */}
      <Grid item xs={12} mt={4}>
        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
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
                return (total + totalPrice).toLocaleString();
              }, 0)} {" "} {translations[language].mmk}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Footer Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Button
          onClick={handleClear}
          variant="outlined"
          color="error"
        >
          {translations[language].clear_cart}
        </Button>

        <Typography variant="h6" fontWeight={600}>
          {translations[language].total_items} :{" "}
          {cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)}
        </Typography>
      </Stack>

      <Stack textAlign="right" direction={"row"} spacing={3} marginY={3}>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to={"/shop"}
        >
          {translations[language].continue_shopping}
        </Button>
        <Button variant="contained" color="primary" size="large" sx={{ px: 4 }} href={`/${userId}/checkout`} >
          {translations[language].to_checkout}
        </Button>
      </Stack>
    </Box>
  );
};

export default Cart;
