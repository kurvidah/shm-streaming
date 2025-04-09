"use client";

import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminSettings = () => {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="bg-gray-800 p-6 rounded-lg w-full md:w-1/2">
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
      </div>
    </div>
  );
};

export default AdminSettings;
