"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Receipt, CreditCard, Banknote, AlertCircle } from "lucide-react"

const UserBill = () => {
  const [bill, setBill] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState("paypal")
  const navigate = useNavigate()

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setBill({
        fullName: "Khunnapat Aubontara",
        email: "khunnapat.aub@email.com",
        phone: "091-819-7016",
        plan: "Standard Plan",
        amount: 426.93,
        dueDate: "2025-05-12",
        billingPeriod: "เมษายน 2568",
      })
    }, 500)
  }, [])

  if (!bill) return <LoadingSpinner />

  return (
    <div className="flex bg-[#0f1629] text-white min-h-screen">
      <UserSidebar />

      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6">My Subscription</h1>

        {/* Section: Billing Invoice */}
        <div className="p-6 rounded-lg shadow-md max-w-3xl mb-8 space-y-4 mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Receipt size={20} className="mr-2" />
            Billing Invoice
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{bill.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Plan</p>
              <p className="font-medium">{bill.plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Billing Period</p>
              <p className="font-medium">{bill.billingPeriod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Due Date</p>
              <p className="font-medium text-400">
                {new Date(bill.dueDate).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Amount Due</p>
              <p className="text-2xl font-bold text-400">
                ฿ {bill.amount.toFixed(2)}
              </p>
            </div>
          </div>

        </div>

        {/* Section: Choose Payment Method */}
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

            {/* Custom dropdown arrow inside the select box */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-sm">
                ▼
            </div>
            </div>

            <div className="flex justify-end space-x-4 pt-2">
            <button className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md">
                Cancel
            </button>
            <button className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md flex items-center space-x-2">
                <span>Pay</span>
            </button>
            </div>
        </div>
        </div>


      </div>
    </div>
  )
}

export default UserBill
