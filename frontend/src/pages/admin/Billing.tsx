"use client";

import React from "react";

import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Search,
  Download,
  AlertCircle,
  Filter,
  Calendar,
  CreditCard,
  DollarSign,
} from "lucide-react";

interface BillingRecord {
  billing_id: number;
  user: {
    username: string;
    email: string;
  };
  plan_name: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  due_date: string;
  payment_status: string;
}

const AdminBilling = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBillingRecords = async () => {
      try {
        setLoading(true);

        // In a real app, you would fetch this data from your API
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/billing/`);
        // setBillingRecords(response.data);

        // For demo purposes
        setTimeout(() => {
          setBillingRecords([
            {
              billing_id: 1,
              user: {
                username: "admin",
                email: "admin@shm.app",
              },
              plan_name: "Standard Plan",
              amount: 14.99,
              payment_method: "Credit Card",
              payment_date: "2025-03-01T10:00:00Z",
              due_date: "2025-03-15T10:00:00Z",
              payment_status: "Paid",
            },
            {
              billing_id: 2,
              user: {
                username: "mod",
                email: "mod@shm.app",
              },
              plan_name: "Basic Plan",
              amount: 9.99,
              payment_method: "PayPal",
              payment_date: "2025-02-20T12:30:00Z",
              due_date: "2025-03-05T12:30:00Z",
              payment_status: "Unpaid",
            },
            {
              billing_id: 3,
              user: {
                username: "bob_jones",
                email: "bob.jones@example.com",
              },
              plan_name: "Premium Plan",
              amount: 19.99,
              payment_method: "Credit Card",
              payment_date: "2025-01-15T08:00:00Z",
              due_date: "2025-02-01T08:00:00Z",
              payment_status: "Paid",
            },
            {
              billing_id: 4,
              user: {
                username: "jane_smith",
                email: "jane.smith@example.com",
              },
              plan_name: "Premium Plan",
              amount: 19.99,
              payment_method: "Credit Card",
              payment_date: "2025-03-10T14:20:00Z",
              due_date: "2025-03-25T14:20:00Z",
              payment_status: "Paid",
            },
            {
              billing_id: 5,
              user: {
                username: "alex_wilson",
                email: "alex.wilson@example.com",
              },
              plan_name: "Standard Plan",
              amount: 14.99,
              payment_method: "PayPal",
              payment_date: "2025-02-28T09:15:00Z",
              due_date: "2025-03-15T09:15:00Z",
              payment_status: "Failed",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching billing records:", err);
        setError("Failed to load billing records");
        setLoading(false);
      }
    };

    fetchBillingRecords();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const filteredRecords = billingRecords.filter((record) => {
    const matchesSearch =
      record.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.plan_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      record.payment_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-500";
      case "unpaid":
        return "bg-yellow-500/20 text-yellow-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Calculate total revenue
  const totalRevenue = billingRecords
    .filter((record) => record.payment_status.toLowerCase() === "paid")
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Billing Management</h1>

          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition">
            <Download size={20} className="mr-2" />
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">
                  ${totalRevenue.toFixed(2)}
                </h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign size={24} className="text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Paid Invoices</p>
                <h3 className="text-2xl font-bold mt-1">
                  {
                    billingRecords.filter(
                      (r) => r.payment_status.toLowerCase() === "paid"
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <CreditCard size={24} className="text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Pending Invoices</p>
                <h3 className="text-2xl font-bold mt-1">
                  {
                    billingRecords.filter(
                      (r) => r.payment_status.toLowerCase() === "unpaid"
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Calendar size={24} className="text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Failed Payments</p>
                <h3 className="text-2xl font-bold mt-1">
                  {
                    billingRecords.filter(
                      (r) => r.payment_status.toLowerCase() === "failed"
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <AlertCircle size={24} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by user or plan..."
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="md:w-64">
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRecords.map((record) => (
                  <tr key={record.billing_id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">
                          {record.user.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          {record.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.plan_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${record.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(record.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          record.payment_status
                        )}`}
                      >
                        {record.payment_status}
                      </span>
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

export default AdminBilling;
