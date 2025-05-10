"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Check, CreditCard, AlertCircle, Receipt} from "lucide-react"

interface SubscriptionPlan {
  plan_id: number
  plan_name: string
  price: number
  max_devices: number
  hd_available: boolean
  ultra_hd_available: boolean
  duration_days: number
}

interface UserSubscriptionData {
  user_subscription_id: number
  plan: SubscriptionPlan
  start_date: string
  end_date: string
}

const UserSubscription = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null)
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSubscription({
        user_subscription_id: 1,
        plan: {
          plan_id: 2,
          plan_name: "Standard Plan",
          price: 14.99,
          max_devices: 3,
          hd_available: true,
          ultra_hd_available: false,
          duration_days: 30,
        },
        start_date: "2025-03-01T10:00:00Z",
        end_date: "2025-03-31T10:00:00Z",
      })

      setAvailablePlans([
        {
          plan_id: 1,
          plan_name: "Basic Plan",
          price: 9.99,
          max_devices: 1,
          hd_available: true,
          ultra_hd_available: false,
          duration_days: 30,
        },
        {
          plan_id: 2,
          plan_name: "Standard Plan",
          price: 14.99,
          max_devices: 3,
          hd_available: true,
          ultra_hd_available: false,
          duration_days: 30,
        },
        {
          plan_id: 3,
          plan_name: "Premium Plan",
          price: 19.99,
          max_devices: 5,
          hd_available: true,
          ultra_hd_available: true,
          duration_days: 30,
        },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const handleUpgrade = (planId: number) => {
    setUpgrading(true)
    setTimeout(() => {
      const newPlan = availablePlans.find((plan) => plan.plan_id === planId)
      if (newPlan && subscription) {
        setSubscription({ ...subscription, plan: newPlan })
      }
      setUpgrading(false)
    }, 1500)
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="flex-1 p-6 md:p-10 text-white">
        <h1 className="text-3xl font-bold mb-6">My Subscription</h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        ) : (
          <>
            {/* Payment Method */}
            <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                Billing Invoice
              </h3>
              <div className="flex items-center">
                <div className="bg-gray-700 rounded p-2 mr-3">
                  <Receipt size={24} />
                </div>
                <div>
                  <p className="font-medium">Amount Due: </p>
                  <p className="text-sm text-gray-400">Due Date: </p>
                </div>
                <button className="ml-auto text-red-500 hover:text-red-400 text-sm hover:underline">Pay Now</button>
              </div>
            </div>

            {/* Plans */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Choose Your Plan</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availablePlans.map((plan) => {
                  const isCurrent = subscription?.plan.plan_id === plan.plan_id
                  return (
                    <div
                      key={plan.plan_id}
                      className={`rounded-lg p-6 transition shadow border-2 border-white${
                        isCurrent ? "border-red-500 bg-red-500/10" : "border-gray-700 hover:border-red-400"
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-1">{plan.plan_name}</h3>
                      <p className="text-lg text-gray-300 mb-4">${plan.price.toFixed(2)} / month</p>

                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <Check className="text-green-500 mr-2" size={18} />
                          {plan.max_devices} {plan.max_devices > 1 ? "devices" : "device"}
                        </li>
                        <li className="flex items-start">
                          <Check className="text-green-500 mr-2" size={18} />
                          {plan.hd_available ? "HD quality" : "Standard quality"}
                        </li>
                        <li className="flex items-start">
                          {plan.ultra_hd_available ? (
                            <Check className="text-green-500 mr-2" size={18} />
                          ) : (
                            <span className="w-[18px] mr-2" />
                          )}
                          <span className={plan.ultra_hd_available ? "" : "text-gray-500"}>
                            {plan.ultra_hd_available ? "Ultra HD available" : "Ultra HD not available"}
                          </span>
                        </li>
                      </ul>

                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium cursor-default"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.plan_id)}
                          disabled={upgrading}
                          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                        >
                          {upgrading ? "Processing..." : plan.price > subscription!.plan.price ? "Upgrade" : "Downgrade"}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserSubscription