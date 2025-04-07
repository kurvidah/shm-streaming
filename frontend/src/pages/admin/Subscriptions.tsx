"use client";

import React from "react";

import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Plus, Edit, Trash2, AlertCircle, Search } from "lucide-react";

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

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);

        // In a real app, you would fetch this data from your API
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/subscription-plans/`);
        // setPlans(response.data);

        // For demo purposes
        setTimeout(() => {
          setPlans([
            {
              plan_id: 1,
              plan_name: "Basic Plan",
              price: 9.99,
              max_devices: 1,
              hd_available: true,
              ultra_hd_available: false,
              duration_days: 30,
            },
            {
              plan_id: 2,
              plan_name: "Standard Plan",
              price: 14.99,
              max_devices: 3,
              hd_available: true,
              ultra_hd_available: false,
              duration_days: 30,
            },
            {
              plan_id: 3,
              plan_name: "Premium Plan",
              price: 19.99,
              max_devices: 5,
              hd_available: true,
              ultra_hd_available: true,
              duration_days: 30,
            },
            {
              plan_id: 4,
              plan_name: "Family Plan",
              price: 24.99,
              max_devices: 8,
              hd_available: true,
              ultra_hd_available: true,
              duration_days: 30,
            },
            {
              plan_id: 5,
              plan_name: "Annual Basic",
              price: 99.99,
              max_devices: 1,
              hd_available: true,
              ultra_hd_available: false,
              duration_days: 365,
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching subscription plans:", err);
        setError("Failed to load subscription plans");
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition">
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
                        <button className="p-1 text-gray-400 hover:text-blue-500">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-500">
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
