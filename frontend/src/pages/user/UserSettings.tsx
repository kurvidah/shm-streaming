"use client";

import React, { useState } from "react";
import UserSidebar from "../../components/UserSidebar"; 

const UserSettings = () => {
  const [language, setLanguage] = useState("en");
  const [downloadOnWifi, setDownloadOnWifi] = useState(true); 
  const [downloadQuality, setDownloadQuality] = useState("720p"); 

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleDownloadOnWifiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadOnWifi(e.target.checked);
  };

  const handleDownloadQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDownloadQuality(e.target.value);
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
      </div>
    </div>
  );
};

export default UserSettings;
