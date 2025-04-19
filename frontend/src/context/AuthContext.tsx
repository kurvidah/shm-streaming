"use client";

import React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

// Set a fallback API URL if the environment variable is not defined
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE_URL = `${API_URL}/api/v1`;

// Storage keys
const TOKEN_KEY = "shm_auth_token";
const USER_KEY = "shm_user";

interface User {
  user_id: number;
  username: string;
  email: string;
  role_id?: number;
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

  // Set up axios interceptor for authentication
  useEffect(() => {
    // Add a request interceptor to include the token in all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (token && storedUser) {
          // Set the token in axios headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Parse and set the user from localStorage
          setUser(JSON.parse(storedUser));

          // Verify the token with the server
          try {
            const response = await axios.get(`${API_BASE_URL}/users/me/`);
            // Update user data in case it changed on the server
            setUser(response.data);
            localStorage.setItem(USER_KEY, JSON.stringify(response.data));
          } catch (verifyError) {
            console.error("Token verification failed:", verifyError);
            // If verification fails, clear auth data
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // Clear invalid auth data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      // Make the login request to Express backend
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        email,
        password,
      });

      // Get the token from the response
      const token = response.data.token;

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Set the token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch user profile
      const userResponse = await axios.get(`${API_BASE_URL}/users/me/`);
      const userData = userResponse.data;
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      return userData;
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else {
          setError(err.response.data?.error || "Login failed");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred. Please try again.");
      }

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

      // Make the registration request
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
        username,
        email,
        password,
      });

      // Login after successful registration
      return await login(email, password);
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data?.error || "Registration failed");
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred. Please try again.");
      }

      throw err;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Remove token from axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Clear user state
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
