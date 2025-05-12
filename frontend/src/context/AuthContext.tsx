import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/v1";

interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  gender?: string;
  birthdate?: number;
  region?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;  // เพิ่มฟังก์ชัน deleteAccount
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  // Set the token in axios headers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const login = async (identifier: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      identifier,
      password,
    });
    const { token, ...userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    navigate("/");
  };

  const register = async (data: RegisterData) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    // ไม่ได้เก็บ token หรือ user ที่นี่
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // ฟังก์ชันสำหรับลบบัญชี
  const deleteAccount = async () => {
    try {
      await axios.delete(`${API_URL}/users`);  // ลบบัญชีจาก API
      logout();  // ทำการ logout
    } catch (error) {
      console.error("Failed to delete account", error);
      throw error;  // ส่งต่อข้อผิดพลาด
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
