"use client";

import React from "react";

import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Search, Edit, Trash2, UserPlus, MoreHorizontal } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState<
    {
      user_id: number;
      username: string;
      email: string;
      role: string;
      subscription: string;
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users/`);
        // setUsers(response.data);

        // For demo purposes
        setTimeout(() => {
          setUsers([
            {
              user_id: 1,
              username: "admin",
              email: "admin@shm.app",
              role: "Admin",
              subscription: "Premium",
              created_at: "2025-01-01",
            },
            {
              user_id: 2,
              username: "mod",
              email: "mod@shm.app",
              role: "Moderator",
              subscription: "Standard",
              created_at: "2025-02-20",
            },
            {
              user_id: 3,
              username: "bob_jones",
              email: "bob.jones@example.com",
              role: "User",
              subscription: "Basic",
              created_at: "2025-01-15",
            },
            {
              user_id: 4,
              username: "jane_smith",
              email: "jane.smith@example.com",
              role: "User",
              subscription: "Premium",
              created_at: "2025-03-10",
            },
            {
              user_id: 5,
              username: "alex_wilson",
              email: "alex.wilson@example.com",
              role: "User",
              subscription: "Standard",
              created_at: "2025-02-28",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user: any) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>

          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition">
            <UserPlus size={20} className="mr-2" />
            Add New User
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
              placeholder="Search users..."
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user: any) => (
                  <tr key={user.user_id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "Admin"
                            ? "bg-red-500/20 text-red-500"
                            : user.role === "Moderator"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.subscription === "Premium"
                            ? "bg-purple-500/20 text-purple-500"
                            : user.subscription === "Standard"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {user.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {user.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-500">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white">
                          <MoreHorizontal size={18} />
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
