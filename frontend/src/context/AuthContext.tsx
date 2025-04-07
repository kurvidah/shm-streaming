"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

// Set a fallback API URL if the environment variable is not defined
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const SECRET_KEY = import.meta.env.DJANGO_SECRET_KEY;

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      if (SECRET_KEY) {
        try {
          // Set default auth header for all requests
          axios.defaults.headers.common["Authorization"] = SECRET_KEY;

          // For demo purposes, simulate a successful auth check
          // In a real app, you would make an API call
          // const response = await axios.get(`${API_URL}/api/auth/user/`);

          // Mock user data for development
          setUser({
            id: 1,
            username: "admin",
            email: "admin@example.com",
          });
        } catch (err) {
          console.error("Auth check failed:", err);
          delete axios.defaults.headers.common["Authorization"];
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      // For demo purposes, simulate a successful login
      // In a real app, you would make an API call
      // const response = await axios.post(`${API_URL}/api/auth/login/`, {
      //   email,
      //   password,
      // });

      // Mock successful login
      const mockUser = {
        id: 1,
        username: "admin",
        email: email,
      };

      axios.defaults.headers.common["Authorization"] = SECRET_KEY;
      setUser(mockUser);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null);

      // For demo purposes, simulate a successful registration
      // In a real app, you would make an API call
      // const response = await axios.post(`${API_URL}/api/auth/register/`, {
      //   username,
      //   email,
      //   password,
      // });

      // Mock successful registration
      const mockUser = {
        id: 1,
        username: username,
        email: email,
      };

      axios.defaults.headers.common["Authorization"] = SECRET_KEY;
      setUser(mockUser);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
