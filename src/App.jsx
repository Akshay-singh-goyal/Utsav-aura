// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import { AdminLayout } from "./Pages/AdminLayout";

// Public Pages
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ContactUs from "./Pages/ContactUs";

// User Pages
import Cart from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrderConfirmation from "./Pages/OrderConfirmation";
import MyOrdersPage from "./Pages/MyOrdersPage";
import PackageList from "./Component/AdminPackage"; // User view
import ProductGallery from "./Component/ProductGallery";
import ProductDetails from "./Component/ProductDetails";
import DecorationGallery from "./Component/DecorationGallery";
import DecorationDetail from "./Pages/DecorationDetail";
import UserChat from "./Component/UserChat";
import ServicesSection from "./Component/ServicesSection";
import RoomShiftingPage from "./Component/RoomShiftingPage";

// Admin Pages
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Settings from "./Pages/Settings";
import AddProduct from "./Pages/AddProduct";
import AdminOrderPage from "./Component/AdminOrderPage";
import AdminLive from "./Component/AdminLive";
import AdminCategoryForm from "./Component/AdminCategoryForm";
import AdminCreatePackage from "./Component/AdminPackage";
import AdminQueries from "./Pages/AdminQueries";
import ViewProfile from "./Pages/ViewProfile";
import AdminChat from "./Component/AdminChat";
import About from "./Pages/About";

// ✅ Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Pages where Navbar/Footer should be hidden
  const noLayoutPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const hideLayout =
    noLayoutPages.includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  // Check authentication on mount / route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  return (
    <>
      {!hideLayout && <Navbar user={user} />}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* ----------------- Public Routes ----------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shop" element={<ProductGallery />} />
        <Route path="/shop/:id" element={<ProductDetails />} />
        <Route path="/decorations" element={<DecorationGallery />} />
        <Route path="/decorations/:id" element={<DecorationDetail />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/about" element={<About />} />

        {/* ----------------- User Chat ----------------- */}
        <Route path="/chat" element={<UserChat />} />

        {/* ----------------- User Protected Routes ----------------- */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-order" element={<MyOrdersPage />} />
        <Route path="/services" element={ <ServicesSection/>} />
        <Route path="/roomshifting" element={<RoomShiftingPage/>}/>
        <Route path="/packages" element={<PackageList />} />

        {/* ----------------- Admin Routes ----------------- */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="order" element={<AdminOrderPage />} />
          <Route path="live" element={<AdminLive />} />
          <Route path="category" element={<AdminCategoryForm />} />
          <Route path="package" element={<AdminCreatePackage />} />
          <Route path="admin-query" element={<AdminQueries />} />
          {/* ✅ Admin Chat Route fixed */}
          <Route path="chatbot" element={<AdminChat />} />
        </Route>

        {/* ----------------- Fallback ----------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
