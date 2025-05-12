"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `/api/v1`;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<any>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/users`);
        setUsers(response.data.rows);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user details");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (user: any) => {
    if (editingUserId === user.user_id) {
      setEditingUserId(null);
      setEditedUser({});
    } else {
      setEditingUserId(user.user_id);
      setEditedUser({ ...user });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedUser((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      const res = await axios.put(`${API_URL}/admin/users/${userId}`, editedUser);
      const updatedUser = res.data.updatedUser || editedUser;

      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, ...updatedUser } : u))
      );
      setEditingUserId(null);
      setEditedUser({});
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/admin/users/${userId}`);
        setUsers(users.filter((u) => u.user_id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    if (searchColumn === "all") {
      return (
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.region?.toLowerCase().includes(term) ||
        user.active_subscription?.toLowerCase().includes(term) ||
        user.created_at?.toLowerCase().includes(term)
      );
    } else {
      const value = user[searchColumn];
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
                <option value="active_subscription">Subscription</option>
                <option value="created_at">Created At</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
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
                  <React.Fragment key={user.user_id}>
                    <tr className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.active_subscription}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white">
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-500"
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-500"
                            onClick={() => handleDelete(user.user_id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {editingUserId === user.user_id && (
                      <tr className="bg-gray-900">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              className="bg-gray-700 text-white rounded-lg px-4 py-2"
                              placeholder="Username"
                              value={editedUser.username || ""}
                              onChange={(e) => handleFieldChange("username", e.target.value)}
                            />
                            <input
                              type="email"
                              className="bg-gray-700 text-white rounded-lg px-4 py-2"
                              placeholder="Email"
                              value={editedUser.email || ""}
                              onChange={(e) => handleFieldChange("email", e.target.value)}
                            />
                            <select
                              className="bg-gray-700 text-white rounded-lg px-4 py-2"
                              value={editedUser.gender || ""}
                              onChange={(e) => handleFieldChange("gender", e.target.value)}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            <input
                              type="date"
                              className="bg-gray-700 text-white rounded-lg px-4 py-2"
                              value={editedUser.birthday?.slice(0, 10) || ""}
                              onChange={(e) => handleFieldChange("birthday", e.target.value)}
                            />
                            <select
                              className="bg-gray-700 text-white rounded-lg px-4 py-2"
                              value={editedUser.region || ""}
                              onChange={(e) => handleFieldChange("region", e.target.value)}
                            >
                              <option value="">Select Region</option>
                              <option value="AF">Africa</option>
                              <option value="AN">Antarctica</option>
                              <option value="AS">Asia</option>
                              <option value="EU">Europe</option>
                              <option value="NA">North America</option>
                              <option value="OC">Oceania</option>
                              <option value="SA">South America</option>
                            </select>

                            <div className="flex justify-end space-x-4 col-span-full">
                              <button
                                className="bg-red-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                onClick={() => handleSaveEdit(user.user_id)}
                              >
                                Save
                              </button>
                              <button
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                                onClick={() => setEditingUserId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
