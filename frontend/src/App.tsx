"use client";

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MovieDetail from "./pages/MovieDetail";
import Player from "./pages/Player";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Debug from "./pages/Debug";

import UserProfile from "./pages/user/Profile";
import UserSubscription from "./pages/user/Subscription";
import UserBill from "./pages/user/Billing";
import UserWatchHistory from "./pages/user/WatchHistory";
import UserDevices from "./pages/user/Devices";
import UserSettings from "./pages/user/UserSettings";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminMovies from "./pages/admin/Movies";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminBilling from "./pages/admin/Billing";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAddNewMovie from "./pages/admin/AddNewMovie";
import AdminAddNewUser from "./pages/admin/AddNewUser";
import AdminAddNewPlan from "./pages/admin/AddNewPlan";

import NotFound from "./pages/NotFound";

const API_URL = `/api/v1`;

// Protected route component for user routes
const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Protected route component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  console.log(user);
  if (!user || !(user.role == 'ADMIN' || user.role == 'MOD')) return <Navigate to="/" replace />;
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
      <Route path="/register" element={<Register />} />
      <Route path="/debug" element={<Debug />} />
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
        path="/billing"
        element={
          <UserRoute>
            <UserBill />
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
      <Route
        path="/settings"
        element={
          <UserRoute>
            <UserSettings />
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
        path="/admin/users/add"
        element={
          <AdminRoute>
            <AdminAddNewUser />
          </AdminRoute>
        }
      />{" "}
      {/* เพิ่ม route นี้ */}
      <Route
        path="/admin/movies"
        element={
          <AdminRoute>
            <AdminMovies />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/movies/add"
        element={
          <AdminRoute>
            <AdminAddNewMovie />
          </AdminRoute>
        }
      />
      <Route 
        path="/admin/subscription/add" 
        element={
          <AdminRoute>
            <AdminAddNewPlan />
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
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
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
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <LoadingSpinner fullScreen />;

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
