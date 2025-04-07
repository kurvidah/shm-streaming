"use client";

import React from "react";
import axios from "axios";

import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MovieDetail from "./pages/MovieDetail";
import Player from "./pages/Player";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/user/Profile";
import UserSubscription from "./pages/user/Subscription";
import UserWatchHistory from "./pages/user/WatchHistory";
import UserDevices from "./pages/user/Devices";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminMovies from "./pages/admin/Movies";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminBilling from "./pages/admin/Billing";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";
import Debug from "./pages/Debug";

// Set a fallback API URL if the environment variable is not defined
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log("Using API URL:", API_URL);

axios.interceptors.request.use((config) => {
  const token = import.meta.env.DJANGO_SECRET_KEY || "your_secret_key_here";
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Protected route component for user routes
const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected route component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // Check if user is admin (assuming role_id 1 is admin)
  // In a real app, you'd check a proper admin flag or role
  if (!user || user.id !== 1) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/movie/:slug" element={<MovieDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/debug" element={<Debug />} />
      <Route path="/register" element={<Register />} />

      {/* User protected routes */}
      <Route
        path="/watch/:id"
        element={
          <UserRoute>
            <Player />
          </UserRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <UserRoute>
            <UserProfile />
          </UserRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <UserRoute>
            <UserSubscription />
          </UserRoute>
        }
      />
      <Route
        path="/history"
        element={
          <UserRoute>
            <UserWatchHistory />
          </UserRoute>
        }
      />
      <Route
        path="/devices"
        element={
          <UserRoute>
            <UserDevices />
          </UserRoute>
        }
      />

      {/* Admin protected routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/movies"
        element={
          <AdminRoute>
            <AdminMovies />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <AdminRoute>
            <AdminSubscriptions />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/billing"
        element={
          <AdminRoute>
            <AdminBilling />
          </AdminRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
