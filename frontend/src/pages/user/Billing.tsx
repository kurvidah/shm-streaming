"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Receipt, CreditCard, AlertCircle } from "lucide-react"
import axios from "axios"

const API_URL = `/api/v1`;


interface Bill {
  billing_id: number
  user_subscription_id: number
  amount: number
  payment_method: string | null
  payment_date: string
  due_date: string
  payment_status: string
}

const UserBill = () => {
  const [bill, setBill] = useState<Bill | null>(null)
  const [selectedMethod, setSelectedMethod] = useState("paypal")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axios.get(`${API_URL}/payment`)
        const billingList = res.data
        const latestBill = billingList[billingList.length - 1]
        setBill(latestBill)
      } catch (err) {
        console.error("Failed to fetch bill:", err)
        setError("Failed to load billing data.")
      } finally {
        setLoading(false)
      }
    }

    fetchBill()
  }, [])


  const handlePay = async () => {
    if (!bill) return;

    setPaying(true);
    setError(null);

    try {
      await axios.post(
      `${API_URL}/payment?billing_id=${bill.billing_id}&payment_method=${selectedMethod}`
      );
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handlePayAndRedirect = async () => {
    await handlePay();
    navigate("/subscription");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-400"
      case "unpaid":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="flex bg-[#0f1629] text-white min-h-screen">
      <UserSidebar />

      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6">My Subscription</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {/* Billing Invoice Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Receipt size={20} className="mr-2" />
            Billing Invoice
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Billing ID</p>
              <p className="font-medium">{bill?.billing_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment Status</p>
              <p className={`font-medium ${getStatusColor(bill?.payment_status || "")}`}>
                {bill?.payment_status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Due Date</p>
              <p className="font-medium">
                {new Date(bill?.due_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Amount Due</p>
              <p className="text-2xl font-bold text-400">
                $ {typeof bill?.amount === "number" ? bill.amount.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mt-8">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CreditCard size={20} className="mr-2" />
            Choose Payment Method
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 rounded-md bg-gray-700 text-white border border-gray-500 focus:outline-none"
              >
                <option value="paypal">PayPal</option>
                <option value="creditcard">Credit Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-sm">
                ▼
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <button
                onClick={() => navigate("/subscription")}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePayAndRedirect}
                disabled={paying}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{paying ? "Processing..." : "Pay"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBill
