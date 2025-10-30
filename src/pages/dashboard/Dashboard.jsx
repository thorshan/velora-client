import React, { useState, useEffect } from "react";
import { Box, Typography, Card } from "@mui/material";
import {
  Store as StoreIcon,
  People as PeopleIcon,
  Inventory as ItemIcon,
  Reviews as ReviewIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";

// API
import { userApi } from "../../api/userApi";
import { brandApi } from "../../api/brandApi";
import { itemApi } from "../../api/itemApi";
import { reviewApi } from "../../api/reviewApi";

// Chart + Date
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";

const Dashboard = () => {
  const { language } = useLanguage();

  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [weeklyItemData, setWeeklyItemData] = useState([]);
  const [weeklyBrandData, setWeeklyBrandData] = useState([]);
  const [weeklyUserData, setWeeklyUserData] = useState([]);
  const [weeklyReviewData, setWeeklyReviewData] = useState([]);

  const days = [
    translations[language]._mon,
    translations[language]._tue,
    translations[language]._wed,
    translations[language]._thu,
    translations[language]._fri,
    translations[language]._sat,
    translations[language]._sun,
  ];

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await userApi.getAllUser();
        const users = res.data;
        setUsers(res.data);

        const today = dayjs();
        const startOfWeek = today.startOf("week").add(1, "day"); 
        const endOfWeek = startOfWeek.add(6, "day");

        const counts = Array(7).fill(0);

        users.forEach((brand) => {
          if (!brand.createdAt) return;
          const createdAt = dayjs(brand.createdAt);

          if (
            createdAt.isAfter(startOfWeek.subtract(1, "day")) &&
            createdAt.isBefore(endOfWeek.add(1, "day"))
          ) {
            const dayIndex = createdAt.day();
            const adjustedIndex = (dayIndex + 6) % 7;
            counts[adjustedIndex]++;
          }
        });

        setWeeklyUserData(counts);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchAllBrands = async () => {
      try {
        const res = await brandApi.getAllBrands();
        const brands = res.data;
        setBrands(res.data);

        const today = dayjs();
        const startOfWeek = today.startOf("week").add(1, "day");
        const endOfWeek = startOfWeek.add(6, "day");

        const counts = Array(7).fill(0);

        brands.forEach((brand) => {
          if (!brand.createdAt) return;
          const createdAt = dayjs(brand.createdAt);

          if (
            createdAt.isAfter(startOfWeek.subtract(1, "day")) &&
            createdAt.isBefore(endOfWeek.add(1, "day"))
          ) {
            const dayIndex = createdAt.day();
            // Shift so Monday = 0
            const adjustedIndex = (dayIndex + 6) % 7;
            counts[adjustedIndex]++;
          }
        });

        setWeeklyBrandData(counts);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };

    const fetchAllItems = async () => {
      try {
        const res = await itemApi.getAllItems();
        const items = res.data;
        setItems(items);

        const today = dayjs();
        const startOfWeek = today.startOf("week").add(1, "day");
        const endOfWeek = startOfWeek.add(6, "day");

        const counts = Array(7).fill(0);

        items.forEach((item) => {
          if (!item.createdAt) return;
          const createdAt = dayjs(item.createdAt);

          if (
            createdAt.isAfter(startOfWeek.subtract(1, "day")) &&
            createdAt.isBefore(endOfWeek.add(1, "day"))
          ) {
            const dayIndex = createdAt.day(); 
            const adjustedIndex = (dayIndex + 6) % 7;
            counts[adjustedIndex]++;
          }
        });

        setWeeklyItemData(counts);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    const fetchAllReviews = async () => {
      try {
        const res = await reviewApi.getAllReviews();
        setReviews(res.data);
        const today = dayjs();
        const startOfWeek = today.startOf("week").add(1, "day");
        const endOfWeek = startOfWeek.add(6, "day");

        const counts = Array(7).fill(0);

        reviews.forEach((review) => {
          if (!review.createdAt) return;
          const createdAt = dayjs(review.createdAt);

          if (
            createdAt.isAfter(startOfWeek.subtract(1, "day")) &&
            createdAt.isBefore(endOfWeek.add(1, "day"))
          ) {
            const dayIndex = createdAt.day();
            // Shift so Monday = 0
            const adjustedIndex = (dayIndex + 6) % 7;
            counts[adjustedIndex]++;
          }
        });

        setWeeklyReviewData(counts);
      } catch (err) {
        console.error("Error fetching review:", err);
      }
    }

    fetchAllItems();
    fetchAllUsers();
    fetchAllBrands();
    fetchAllReviews();
  }, []);

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* --- Stats Cards --- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobile
            sm: "repeat(4, 1fr)", // tablet
            md: "repeat(4, 1fr)", // medium screens
            lg: "repeat(4, 1fr)", // large screens
          },
          gap: 2,
        }}
      >
        {/* Users */}
        <StatCard
          icon={<PeopleIcon color="primary" />}
          title={translations[language].users}
          value={users.length}
          days={days}
          data={weeklyUserData}
        />

        {/* Brands */}
        <StatCard
          icon={<StoreIcon color="primary" />}
          title={translations[language].brand}
          value={brands.length}
          days={days}
          data={weeklyBrandData}
        />

        {/* Items */}
        <StatCard
          icon={<ItemIcon color="primary" />}
          title={translations[language].items}
          value={items.length}
          days={days}
          data={weeklyItemData}
        />

        {/* Reviews (Static for now) */}
        <StatCard
          icon={<ReviewIcon color="primary" />}
          title={translations[language].reviews}
          value={reviews.length}
          days={days}
          data={weeklyReviewData}
        />
      </Box>

      {/* --- Weekly Items Line Chart --- */}
      <Card sx={{ p: 2, boxShadow: "none" }}>
        <Typography variant="h6" color="primary" mb={2}>
          {translations[language].item_created_this_week}
        </Typography>
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: days,
            },
          ]}
          series={[
            {
              label: translations[language].item_created,
              data: weeklyItemData,
              color: "#1976d2",
            },
          ]}
          height={300}
        />
      </Card>
    </Box>
  );
};

// --- Small Reusable Card Component ---
const StatCard = ({ icon, title, value, days, data }) => (
  <Card
    elevation={2}
    sx={{
      p: 1.5, // compact padding
      height: "auto", // allow to shrink
      minHeight: 100,
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.2s ease",
      boxShadow: "none",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: 4,
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {icon}
      <Typography variant="subtitle1" color="primary" fontWeight={600}>
        {title}
      </Typography>
      <Typography
        variant="h5"
        color="secondary"
        fontWeight="bold"
        sx={{ lineHeight: 1 }}
      >
        {value}
      </Typography>
    </Box>
    <LineChart
      xAxis={[
        {
          data: days,
          scaleType: "point",
          tickLength: 0,
        },
      ]}
      series={[
        {
          data: data,
          color: "#1976d2",
          showMark: false,
        },
      ]}
      height={100}
      margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
      grid={{ vertical: false, horizontal: false }}
      sx={{
        "& .MuiChartsAxis-root": {
          display: "none",
        },
      }}
    />
  </Card>
);

export default Dashboard;
