"use client";

import React, { useState } from "react";
import UserSidebar from "../../components/UserSidebar"; 
import axios from "axios";
import { Key } from "lucide-react"

const API_URL = `/api/v1`;

const UserSettings = () => {
  const [language, setLanguage] = useState("en");
  const [downloadOnWifi, setDownloadOnWifi] = useState(true); 
  const [downloadQuality, setDownloadQuality] = useState("720p"); 

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleDownloadOnWifiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadOnWifi(e.target.checked);
  };

  const handleDownloadQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDownloadQuality(e.target.value);
  };

  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("Current Password:", formData.currentPassword);
    console.log("New Password:", formData.newPassword);
    console.log("Confirm Password:", formData.confirmPassword);

    try {
      const response = await axios.put(`${API_URL}/users/update-password`, {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      alert("Password updated successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert("Failed to update password: " + error?.response?.data?.message || error.message);
    }
  };


  return (
    <div className="flex">
      <UserSidebar /> 

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">User Settings</h1>

        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-1/2 mb-6">
          <h2 className="text-xl font-semibold mb-4">Language</h2>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-900 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="en">English</option>
            <option value="th">ไทย</option>
          </select>
        </div>

        
        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-1/2 mb-6">
          <h2 className="text-xl font-semibold mb-4">Download Settings</h2>
          
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={downloadOnWifi}
              onChange={handleDownloadOnWifiChange}
              id="download-on-wifi"
              className="mr-2"
            />
            <label htmlFor="download-on-wifi" className="text-white">
              Download only on Wi-Fi
            </label>
          </div>

          
          <div>
            <label htmlFor="download-quality" className="text-white block mb-2">
              Download Quality
            </label>
            <select
              id="download-quality"
              value={downloadQuality}
              onChange={handleDownloadQualityChange}
              className="bg-gray-900 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4k">4K</option>
            </select>
          </div>
        </div>

        {/* Password Settings Block */}
        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-2/3 mb-6">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="bg-gray-900 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
          >
            Update Password
          </button>
        </div>


        
      </div>
    </div>
  );
};

export default UserSettings;
