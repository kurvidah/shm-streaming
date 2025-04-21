"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<
    {
      user_id: number;
      username: string;
      email: string;
      gender: string;
      age: number;
      region: string;
      subscription: string;
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers([
        {
          user_id: 1,
          username: "alice_brown",
          email: "alice.brown@example.com",
          gender: "Female",
          age: 28,
          region: "Europe",
          subscription: "Premium",
          created_at: "2025-01-20",
        },
        {
          user_id: 2,
          username: "bob_jones",
          email: "bob.jones@example.com",
          gender: "Male",
          age: 35,
          region: "North America",
          subscription: "Basic",
          created_at: "2025-02-05",
        },
        {
          user_id: 3,
          username: "carol_white",
          email: "carol.white@example.com",
          gender: "Female",
          age: 22,
          region: "Asia",
          subscription: "Standard",
          created_at: "2025-03-12",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [searchColumn, setSearchColumn] = useState("all");
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    if (searchColumn === "all") {
      return (
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.region.toLowerCase().includes(term) ||
        user.subscription.toLowerCase().includes(term) ||
        user.created_at.toLowerCase().includes(term)
      );
    } else {
      const value = user[searchColumn as keyof typeof user];
      return typeof value === "string" && value.toLowerCase().includes(term);
    }
  });

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition"
            onClick={() => navigate("/admin/users/add")}
          >
            <Plus size={20} className="mr-2" />
            Add New User
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Filter Column */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Columns</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
                <option value="region">Region</option>
                <option value="subscription">Subscription</option>
                <option value="created_at">Created At</option>
              </select>

            </div>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.subscription}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.created_at}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-white">
                          <Eye size={18} />
                        </button>
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
      </div>
    </div>
  );
};

export default AdminUsers;
