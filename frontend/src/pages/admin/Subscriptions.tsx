
"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `/api/v1`;

const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPlan, setEditingPlan] = useState(null);

  const [newPlan, setNewPlan] = useState({
    plan_name: "",
    price: 0,
    max_devices: 1,
    hd_available: false,
    ultra_hd_available: false,
    duration_days: 30,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/plans`);
        setPlans(response.data.rows);
        setLoading(false);
      } catch (err) {
        setError("Failed to load subscription plans");
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPlan = async () => {
    try {
      await axios.post(`${API_URL}/admin/plans`, newPlan);
      setPlans([...plans, newPlan]);
      setNewPlan({
        plan_name: "",
        price: 0,
        max_devices: 1,
        hd_available: false,
        ultra_hd_available: false,
        duration_days: 30,
      });
    } catch (err) {
      setError("Failed to add subscription plan");
    }
  };

  const handleEditClick = (plan) => {
    if (editingPlan === plan.plan_id) {
      // ถ้าคลิกแผนเดิมอีกครั้ง ให้ปิด dropdown และ clear form
      setEditingPlan(null);
      setNewPlan({
        plan_name: "",
        price: 0,
        max_devices: 1,
        hd_available: false,
        ultra_hd_available: false,
        duration_days: 30,
      });
    } else {
      // ถ้าเป็นแผนใหม่ ให้เปิด dropdown และโหลดข้อมูลแผนลง form
      setEditingPlan(plan.plan_id);
      setNewPlan({ ...plan });
    }
  };


  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  const handleSaveEdit = async (planId) => {
    try {
      await axios.put(`${API_URL}/admin/plans/${planId}`, newPlan);
      setPlans(
        plans.map((plan) =>
          plan.plan_id === planId ? { ...plan, ...newPlan } : plan
        )
      );
      setEditingPlan(null);
    } catch (err) {
      setError("Failed to save plan changes");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm(`Are you sure you want to delete this plan?`)) {
      try {
        await axios.delete(`${API_URL}/admin/plans/${planId}`);
        setPlans(plans.filter((plan) => plan.plan_id !== planId));
      } catch (err) {
        setError("Failed to delete plan");
      }
    }
  };

  const handleFieldChange = (field, value) => {
    setNewPlan({ ...newPlan, [field]: value });
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
            onClick={() => setEditingPlan("new")}
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
          <div>Loading...</div>
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
                  <tr key={plan.plan_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{plan.plan_name}</td>
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
                        <button
                          className="p-1 text-gray-400 hover:text-blue-500"
                          onClick={() => handleEditClick(plan)}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          className="p-1 text-gray-400 hover:text-red-500"
                          onClick={() => handleDeletePlan(plan.plan_id)}
                        >
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

        {editingPlan && (
          <div className="bg-gray-800 p-6 mt-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Edit Subscription Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  className="bg-gray-700 text-white rounded-lg px-4 py-2"
                  value={newPlan.plan_name}
                  onChange={(e) => handleFieldChange("plan_name", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-300 mb-1">Price (USD)</label>
                <input
                  type="number"
                  className="bg-gray-700 text-white rounded-lg px-4 py-2"
                  value={newPlan.price}
                  onChange={(e) => handleFieldChange("price", parseFloat(e.target.value))}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-300 mb-1">Max Devices</label>
                <input
                  type="number"
                  className="bg-gray-700 text-white rounded-lg px-4 py-2"
                  value={newPlan.max_devices}
                  onChange={(e) => handleFieldChange("max_devices", parseInt(e.target.value))}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-300 mb-1">Features</label>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={newPlan.hd_available}
                      onChange={(e) => handleFieldChange("hd_available", e.target.checked)}
                    />
                    HD
                  </label>
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={newPlan.ultra_hd_available}
                      onChange={(e) => handleFieldChange("ultra_hd_available", e.target.checked)}
                    />
                    Ultra HD
                  </label>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-300 mb-1">Duration</label>
                <select
                  className="bg-gray-700 text-white rounded-lg px-4 py-2"
                  value={newPlan.duration_days}
                  onChange={(e) => handleFieldChange("duration_days", parseInt(e.target.value))}
                >
                  <option value={30}>Monthly</option>
                  <option value={365}>Yearly</option>
                </select>
              </div>
            </div>

        <div className="flex justify-end space-x-4 col-span-full">
          <button
          onClick={() =>
          editingPlan === "new"
          ? handleAddPlan()
          : handleSaveEdit(editingPlan)
          }
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
          Save
          </button>
          <button onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg" >
          Cancel
          </button>
        </div>
      </div>
      )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;

