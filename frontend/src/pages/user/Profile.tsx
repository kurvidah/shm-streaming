"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import { User, Mail, Key, Save, Calendar, Trash2 } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API_URL = `/api/v1`;

const UserProfile = () => {
  const { user, deleteAccount } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    region: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })


  // ฟังก์ชันในการแปลงวันที่จาก timestamp หรือรูปแบบอื่นๆ ให้เป็น 'YYYY-MM-DD'
  const formatDate = (date: string | number | Date): string => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Fetch user data when the component mounts or when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/users`)
          const userData = response.data

          // Format birthDate to 'YYYY-MM-DD' if not empty
          const formattedBirthDate = userData.birthdate
            ? formatDate(userData.birthdate)
            : ""

          setFormData((prev) => ({
            ...prev,
            username: userData.username || "",
            email: userData.email || "",
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            gender: userData.gender || "",  // ถ้าไม่มีข้อมูลจะเป็นช่องว่าง
            birthDate: formattedBirthDate,  // รูปแบบวันที่ที่ต้องการ
            region: userData.region || "",  // ถ้าไม่มีข้อมูลจะเป็นช่องว่าง
          }))
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        }
      }
    }

    fetchUserData()
  }, [user]) // This useEffect will re-run when the `user` changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "birthDate") {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
      if (!isValidDate && value !== "") return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        gender: formData.gender || null,  // หากไม่มีข้อมูลให้ส่งค่าเป็น null
        birthdate: formData.birthDate || null,  // หากไม่มีข้อมูลให้ส่งค่าเป็น null
        region: formData.region || null,  // หากไม่มีข้อมูลให้ส่งค่าเป็น null
      }

      const response = await axios.put(
        `${API_URL}/users`,
        payload
      )

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Update failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();  // เรียก deleteAccount จาก AuthContext
      alert("Your account has been deleted.");
      navigate("/login");  
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account.");
    }
  };


  return (
    <div className="flex">
      <UserSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-6 mb-8">
              <div className="flex-1">
                <label className="block text-gray-400 text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-400 text-sm font-medium mb-2">Birth Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-gray-400 text-sm font-medium mb-2">Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Africa">Africa</option>
                </select>
              </div>
            </div>

            {/* Password section */}

            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>

              {success && <div className="ml-4 text-green-500">Profile updated successfully!</div>}

              <button
                type="button"
                onClick={() => confirm("Are you sure you want to delete your account?") && handleDeleteAccount()}
                className="text-red-500  hover:text-white hover:underline px-6 py-3 transition flex"
              >
                <>
                    <Trash2 size={20} className="mr-2" />
                    Delete My Account
                </>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
