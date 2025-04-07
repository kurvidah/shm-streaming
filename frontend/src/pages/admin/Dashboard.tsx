"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Users, Film, CreditCard, TrendingUp } from "lucide-react";
import React from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats/`);
        // setStats(response.data);

        // For demo purposes
        setTimeout(() => {
          setStats({
            totalUsers: 1254,
            newUsers: 48,
            totalMovies: 523,
            newMovies: 12,
            activeSubscriptions: 987,
            revenue: "$12,458",
            revenueChange: "8.2%",
            positiveRevenue: true,
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users size={24} className="text-blue-500" />}
                change={`+${stats.newUsers} this week`}
                positive={true}
              />

              <StatCard
                title="Content Library"
                value={stats.totalMovies}
                icon={<Film size={24} className="text-purple-500" />}
                change={`+${stats.newMovies} this week`}
                positive={true}
              />

              <StatCard
                title="Active Subscriptions"
                value={stats.activeSubscriptions}
                icon={<CreditCard size={24} className="text-green-500" />}
              />

              <StatCard
                title="Monthly Revenue"
                value={stats.revenue}
                icon={<TrendingUp size={24} className="text-yellow-500" />}
                change={stats.revenueChange}
                positive={stats.positiveRevenue}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="bg-blue-500/20 text-blue-500 p-2 rounded">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-gray-400">
                      john_doe@example.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="bg-purple-500/20 text-purple-500 p-2 rounded">
                    <Film size={20} />
                  </div>
                  <div>
                    <p className="font-medium">New movie added</p>
                    <p className="text-sm text-gray-400">
                      The Shawshank Redemption
                    </p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="bg-green-500/20 text-green-500 p-2 rounded">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-medium">New subscription</p>
                    <p className="text-sm text-gray-400">
                      Premium Plan - jane_smith@example.com
                    </p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">System Status</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Server Load</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">42%</p>
                    <div className="w-2/3 bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "42%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Storage</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">68%</p>
                    <div className="w-2/3 bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Bandwidth</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">23%</p>
                    <div className="w-2/3 bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "23%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
