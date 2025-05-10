// src/pages/AddNewPlan.tsx
import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const AddNewPlan: React.FC = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [maxDevice, setMaxDevice] = useState('');
  const [features, setFeatures] = useState<{ hd: boolean; ultraHd: boolean }>({
    hd: false,
    ultraHd: false,
  });
  const [duration, setDuration] = useState<'monthly' | 'annual' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const planData = {
      planName,
      price,
      maxDevice,
      features,
      duration,
    };

    const PLAN_DATA = {
      plan_name: planName,
      price: parseFloat(price), // Ensure price is a number
      max_devices: parseInt(maxDevice, 10), // Ensure maxDevice is an integer
      hd_available: features.hd ? 1 : 0, // Convert boolean to 1 or 0
      ultra_hd_available: features.ultraHd ? 1 : 0, // Convert boolean to 1 or 0
      duration_days: duration === 'monthly' ? 30 : (duration === 'annual' ? 365 : 0), // Convert duration to days (adjust as needed)
    };

    try {
      const response = await axios.post(`${API_URL}/plans`, PLAN_DATA);
      navigate('/admin/subscriptions');
    } catch (error: any) {
      console.error('Error adding plan:', error.response ? error.response.data : error.message);
      setError('Failed to add plan. Please try again.');
    }  finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen bg-[#121826] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-[#1E293B] p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Add New Subscription Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Plan Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full bg-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
                placeholder="Enter plan name"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Max Devices</label>
              <input
                type="number"
                value={maxDevice}
                onChange={(e) => setMaxDevice(e.target.value)}
                className="w-full bg-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
                placeholder="Enter max devices"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as 'monthly' | 'annual')}
                className="w-full bg-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
                required
              >
                <option value="">Select duration</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2">Features</label>
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={features.hd}
                  onChange={() => setFeatures({ ...features, hd: !features.hd })}
                  className="form-checkbox text-red-500 bg-[#334155] rounded focus:ring-0"
                />
                <span className="ml-2">HD</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={features.ultraHd}
                  onChange={() => setFeatures({ ...features, ultraHd: !features.ultraHd })}
                  className="form-checkbox text-red-500 bg-[#334155] rounded focus:ring-0"
                />
                <span className="ml-2">Ultra HD</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Add Plan
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewPlan;
