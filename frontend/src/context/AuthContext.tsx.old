"use client";

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

// Storage key for user data
const USER_KEY = "shm_user";

// Django secret key for authorization
const SECRET_KEY = import.meta.env.DJANGO_SECRET_KEY || "your_secret_key_here"; // In production, this would be an environment variable
console.log(SECRET_KEY);

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

  // Set up authorization header
  const setAuthHeader = () => {
    axios.defaults.headers.common["Authorization"] = SECRET_KEY;
  };

  // Remove authorization header
  const removeAuthHeader = () => {
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Check for stored user in localStorage
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedUser) {
          // Set the authorization header
          setAuthHeader();

          // Set the user from localStorage
          setUser(JSON.parse(storedUser));

          // In a real app with JWT, you would verify the token here
          // const response = await axios.get(`${API_BASE_URL}/users/me/`);
          // setUser(response.data);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // Clear invalid auth data
        localStorage.removeItem(USER_KEY);
        removeAuthHeader();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      // For production, uncomment and use the actual API call
      // const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
      //   email,
      //   password,
      // });
      //
      // Set the authorization header
      // setAuthHeader();
      //
      // Fetch user profile
      // const userResponse = await axios.get(`${API_BASE_URL}/users/me/`);
      // const userData = userResponse.data;
      // setUser(userData);
      // localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Mock successful login
      const mockUser = {
        id: 1,
        username: "admin",
        email: email,
      };

      // Set auth header and store user
      setAuthHeader();
      setUser(mockUser);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
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

      // For production, uncomment and use the actual API call
      // const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
      //   username,
      //   email,
      //   password,
      // });
      //
      // Login after successful registration
      // await login(email, password);

      // Mock successful registration
      const mockUser = {
        id: 1,
        username: username,
        email: email,
      };

      // Set auth header and store user
      setAuthHeader();
      setUser(mockUser);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem(USER_KEY);

    // Remove authorization header
    removeAuthHeader();

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
