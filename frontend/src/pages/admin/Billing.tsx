"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const AdminBilling = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [paidInvoices, setPaidInvoices] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [failedPayments, setFailedPayments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBillingRecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/billings`);
        const data = response.data;
        setBillingRecords(data.rows);
        setTotalRevenue(data.totalRevenue);
        setPaidInvoices(data.paidInvoices);
        setPendingInvoices(data.pendingInvoices);
        setFailedPayments(data.failedPayments);
        setLoading(false);
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-green-500/20 text-green-500";
      case "pending":
      case "unpaid":
        return "bg-yellow-500/20 text-yellow-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

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
          <Card
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<DollarSign size={24} className="text-green-500" />}
            bg="green"
          />
          <Card
            title="Paid Invoices"
            value={paidInvoices.toString()}
            icon={<CreditCard size={24} className="text-blue-500" />}
            bg="blue"
          />
          <Card
            title="Pending Invoices"
            value={pendingInvoices.toString()}
            icon={<Calendar size={24} className="text-yellow-500" />}
            bg="yellow"
          />
          <Card
            title="Failed Payments"
            value={failedPayments.toString()}
            icon={<AlertCircle size={24} className="text-red-500" />}
            bg="red"
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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

        {/* Table */}
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
                <tr className="bg-gray-900 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.billing_id} className="border-t border-gray-700 hover:bg-gray-700/20">
                    <td className="px-6 py-4">{record.user.username}</td>
                    <td className="px-6 py-4">{record.user.email}</td>
                    <td className="px-6 py-4">{record.plan_name}</td>
                    <td className="px-6 py-4">${record.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{record.payment_method}</td>
                    <td className="px-6 py-4">{formatDate(record.due_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(record.payment_status)}`}>
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

// 🔹 Card component
const Card = ({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}) => {
  const bgClass = {
    green: "bg-green-500/20",
    blue: "bg-blue-500/20",
    yellow: "bg-yellow-500/20",
    red: "bg-red-500/20",
  }[bg];

  return (
    <div className={`rounded-lg p-6 ${bgClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-white text-xl font-bold">{value}</h3>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

export default AdminBilling;
