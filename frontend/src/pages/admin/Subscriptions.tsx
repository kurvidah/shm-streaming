"use client";

import React from "react";

import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Plus, Edit, Trash2, AlertCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

interface SubscriptionPlan {
  plan_id: number;
  plan_name: string;
  price: number;
  max_devices: number;
  hd_available: boolean;
  ultra_hd_available: boolean;
  duration_days: number;
}

const AdminSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/plans`);
        setPlans(response.data.rows);
        setLoading(false);

      } catch (err: any) {
        console.error("Error fetching subscription plans:", err.message);
        setError("Failed to load subscription plans");
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeletePlan = async (selectedPlanID: number) => {
    if (window.confirm(`This action is irreversible. Are you sure you want to delete a plan ID: ${selectedPlanID}?`)){
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`${API_URL}/admin/plans/${selectedPlanID}`);
        setPlans(plans.filter((plan) => plan.plan_id !== selectedPlanID));
        setLoading(false);

      } catch (err: any) {
        console.error(`Error deleting a plan witth ID ${selectedPlanID}:`, err.message);
        setError(`Failed to delete plan with ID ${selectedPlanID}`);
        setLoading(false);

      }
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Subscription Plans</h1>

          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition"
            onClick={() => navigate("/admin/subscription/add")}
          >
            <Plus size={20} className="mr-2" />
            Add New Plan
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search plans..."
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Max Devices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPlans.map((plan) => (
                  <tr key={plan.plan_id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{plan.plan_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${plan.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.max_devices}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
                          HD {plan.hd_available ? "✓" : "✗"}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs">
                          Ultra HD {plan.ultra_hd_available ? "✓" : "✗"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.duration_days === 30 ? "Monthly" : "Annual"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        {/* edit plan */}
                        <button className="p-1 text-gray-400 hover:text-blue-500">
                          <Edit size={18} />
                        </button>

                        {/* delete plan */}
                        <button className="p-1 text-gray-400 hover:text-red-500" onClick={() => handleDeletePlan(plan.plan_id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Active Subscriptions</h3>
            <p className="text-3xl font-bold">1,248</p>
            <p className="text-sm text-gray-400 mt-2">+12% from last month</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Most Popular Plan</h3>
            <p className="text-3xl font-bold">Standard</p>
            <p className="text-sm text-gray-400 mt-2">54% of subscribers</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Average Revenue</h3>
            <p className="text-3xl font-bold">$16.42</p>
            <p className="text-sm text-gray-400 mt-2">Per subscriber</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;