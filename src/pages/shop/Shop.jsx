import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton,
  Drawer,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, FilterList } from "@mui/icons-material";
import { Link } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import HomeFooter from "../../components/footer/HomeFooter";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { itemApi } from "../../api/itemApi";
import { brandApi } from "../../api/brandApi";
import { reviewApi } from "../../api/reviewApi";
import { promotionApi } from "../../api/promotionApi";
import { categoryApi } from "../../api/categoryApi";

const Home = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const priceRanges = [
    { label: "0 - 5,000", min: 0, max: 5000 },
    { label: "5,000 - 50,000", min: 5000, max: 50000 },
    { label: "50,000 - 100,000", min: 50000, max: 100000 },
    { label: "100,000+", min: 100000, max: Infinity },
  ];

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const itemRes = await itemApi.getAllItems();
      const itemsData = itemRes.data;

      const [allReviews, allPromotions] = await Promise.all([
        Promise.all(
          itemsData.map((item) => reviewApi.getReviewByItem(item._id))
        ),
        Promise.all(
          itemsData.map((item) => promotionApi.getPromotionByItem(item._id))
        ),
      ]);

      setItems(itemsData);
      setReviews(allReviews.flatMap((r) => r.data || []));
      setPromotions(allPromotions.flatMap((p) => p.data || []));
    } catch (err) {
      console.error(err);
      setMessage("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await brandApi.getAllBrands();
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBrands();
    fetchCategories();
  }, []);

  // Filtering logic
  const filteredItems = useMemo(
    () => {
      let result = [...items];

      if (searchQuery.trim()) {
        result = result.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedBrand) {
        result = result.filter((item) => item.brand?._id === selectedBrand);
      }

      if (selectedCategory) {
        result = result.filter(
          (item) => item.category?._id === selectedCategory
        );
      }

      if (selectedPriceRange) {
        const range = priceRanges.find((r) => r.label === selectedPriceRange);
        if (range) {
          result = result.filter(
            (item) => item.price >= range.min && item.price <= range.max
          );
        }
      }

      return result;
    },
    //es-lint-disable-next-line
    [items, searchQuery, selectedBrand, selectedCategory, selectedPriceRange]
  );

  // Compute average review
  const getAverageRating = (itemId) => {
    const itemReviews = reviews.filter(
      (r) => String(r.item?._id || r.item) === String(itemId)
    );
    if (itemReviews.length === 0) return 0;
    const sum = itemReviews.reduce((acc, r) => acc + r.reviewRating, 0);
    return Math.round((sum / itemReviews.length) * 2) / 2;
  };

  const getPromo = (itemId) => {
    const promoItem = promotions.find(
      (p) => String(p.item?._id || p._id) === String(itemId)
    );
    return promoItem || null;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 🔹 Navbar */}
      <NavBar />

      {/* 🔹 Search & Filter Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <IconButton color="primary" onClick={() => setDrawerOpen(true)}>
          <FilterList />
        </IconButton>

        <TextField
          fullWidth
          size="small"
          placeholder={translations[language].search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 🔹 Drawer Sidebar Filters */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          {/* Brand Dropdown */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{translations[language].brand}</InputLabel>
            <Select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              label={translations[language].brand}
            >
              <MenuItem value="">{translations[language].all_brands}</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category Dropdown */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>{translations[language].category}</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label={translations[language].category}
            >
              <MenuItem value="">
                {translations[language].all_categories}
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price Range Dropdown */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>{translations[language].price_range}</InputLabel>
            <Select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              label={translations[language].price_range}
            >
              <MenuItem value="">{translations[language].all_price}</MenuItem>
              {priceRanges.map((range) => (
                <MenuItem key={range.label} value={range.label}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              {translations[language].apply}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => {
                setSelectedBrand("");
                setSelectedCategory("");
                setSelectedPriceRange("");
                setSearchQuery("");
              }}
            >
              {translations[language].reset}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Item Cards */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {loading ? (
          <Grid spacing={2}>
            {Array.from(new Array(20)).map((_, index) => (
              <Grid key={index}>
                <Card sx={{ width: 220 }}>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton width="20%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredItems.length > 0 ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {filteredItems.map((item) => {
                const promo = getPromo(item._id);
                const avgRating = getAverageRating(item._id);
                const reviewCount = reviews.filter(
                  (r) => String(r.item?._id || r.item) === String(item._id)
                ).length;

                return (
                  <Card
                    key={item._id}
                    sx={{
                      width: 220,
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/${item._id}/detail`}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      {/* Discount badge */}
                      {promo && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            bgcolor: "error.main",
                            color: "#fff",
                            px: 1,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          -{promo.discount}%
                        </Box>
                      )}

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

                        <Typography variant="caption" color="text.secondary">
                          {item.brand?.name} {" ・ "} {item.category?.name}
                        </Typography>

                        {/* Price */}
                        <Box sx={{ mt: 1 }}>
                          {promo ? (
                            <>
                              <Typography
                                color="text.secondary"
                                sx={{
                                  textDecoration: "line-through",
                                  opacity: 0.7,
                                }}
                              >
                                {item.price.toLocaleString()}
                                {" "}
                                {translations[language].mmk}
                              </Typography>
                              <Typography
                                color="error.main"
                                sx={{ fontWeight: "bold" }}
                              >
                                {(
                                  item.price -
                                  (item.price * promo.discount) / 100
                                ).toLocaleString()} {" "}{translations[language].mmk}
                                
                              </Typography>
                            </>
                          ) : (
                            <Typography
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.price.toLocaleString()}{" "}{translations[language].mmk}
                              
                            </Typography>
                          )}
                        </Box>

                        {/* Reviews */}
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
                );
              })}
            </Box>
          </Box>
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
