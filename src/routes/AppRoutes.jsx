import React from "react";
import { Routes, Route } from "react-router-dom";
import { ROLES } from "../utils/constants";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Home
import Home from "../pages/Home";
import ItemDetail from "../pages/Items/ItemDetail";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart/Checkout";
import Shop from "../pages/shop/Shop";
import Privacy from "../pages/regulations/Privacy";
import Terms from "../pages/regulations/Terms";
import About from "../pages/home/About";
import Contact from "../pages/home/Contact";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Error
import NotFound from "../pages/errors/NotFound";
import Forbidden from "../pages/errors/Forbidden";

// Admin
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import User from "../pages/user/User";
import Brand from "../pages/brand/Brand";
import Category from "../pages/category/Category";
import Item from "../pages/Items/Item";
import Review from "../pages/review/Review";
import Promotion from "../pages/promotion/Promotion";
import WriteReview from "../pages/review/WriteReview";
import Profile from "../pages/user/Profile";
import Order from "../pages/user/Order";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms-and-conditions" element={<Terms />} />
      <Route path="/policy" element={<Privacy />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/:id/detail" element={<ItemDetail />} />
      <Route
        path="/:id/cart"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:id/checkout"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:id/write-review"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]}>
            <WriteReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:id/profile"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/auth"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/auth/dashboard"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/users"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/brands"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <Brand />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/categories"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <Category />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/items"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR]}>
              <Item />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/reviews"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR]}>
              <Review />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/promotions"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <Promotion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/orders"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MODERATOR]}>
              <Order />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Error Routes */}
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/auth/*" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
