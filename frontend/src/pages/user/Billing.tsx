"use client"

import { useEffect, useState } from "react"
import UserSidebar from "../../components/UserSidebar"

const BillingPage = () => {
  const [bill, setBill] = useState<any>(null)

  useEffect(() => {
    setBill({
      phone: "091-819-7016",
      plan: "Standard Plan",
      amount: 426.93,
      dueDate: "2025-05-12",
      billingPeriod: "เมษายน 2568",
    })
  }, [])

  return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-1 p-6 md:p-10 bg-black text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">จ่ายบิล</h1>

        {/* Billing Summary */}
        <div className="bg-white text-black rounded-xl shadow-lg p-5 max-w-xl space-y-4">
          <div className="flex items-center space-x-4">
            <img src="/ais-logo.png" alt="AIS" className="h-10 w-10" />
            <div className="text-lg font-semibold">{bill?.phone}</div>
          </div>

          <div className="text-sm text-gray-700">ยอดที่ต้องการชำระ:</div>
          <div className="text-3xl font-bold text-green-700">
            ฿ {bill?.amount.toFixed(2)}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
            <div>รอบบิล: {bill?.billingPeriod}</div>
            <div>กำหนดชำระ: {new Date(bill?.dueDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}</div>
          </div>

          <button className="text-green-600 text-sm underline">รายละเอียดบิล &gt;</button>
        </div>

        {/* Payment Section */}
        <div className="max-w-xl mt-6 bg-white text-black rounded-xl shadow-lg p-5 space-y-4">
          <div className="text-xl font-bold">เลือกวิธีชำระเงิน</div>

          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Credit/Debit Card</option>
            <option>PromptPay</option>
            <option>Internet Banking</option>
          </select>

          <div className="flex justify-between items-center pt-4 border-t mt-4 text-lg font-semibold">
            <span>ยอดชำระ:</span>
            <span>฿ {bill?.amount.toFixed(2)}</span>
          </div>

          <div className="flex space-x-4 pt-4">
            <button className="flex-1 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-black font-medium">
              ยกเลิก
            </button>
            <button className="flex-1 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-medium">
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage
