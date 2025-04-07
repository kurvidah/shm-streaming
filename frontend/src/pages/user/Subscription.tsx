"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Check, CreditCard, Calendar, AlertCircle } from "lucide-react"

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
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true)

        // In a real app, you would fetch this data from your API
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscriptions/`);
        // setSubscription(response.data);

        // For demo purposes
        setTimeout(() => {
          // Demo subscription data
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

          // Demo available plans
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
      } catch (err) {
        console.error("Error fetching subscription data:", err)
        setError("Failed to load subscription information")
        setLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [])

  const handleUpgrade = async (planId: number) => {
    setUpgrading(true)

    // Simulate API call
    setTimeout(() => {
      // Update subscription with the new plan
      const newPlan = availablePlans.find((plan) => plan.plan_id === planId)
      if (newPlan && subscription) {
        setSubscription({
          ...subscription,
          plan: newPlan,
        })
      }
      setUpgrading(false)
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Subscription</h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Current Subscription */}
            {subscription && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Current Plan</h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-red-500">{subscription.plan.plan_name}</h3>
                    <p className="text-gray-400 mt-1">${subscription.plan.price.toFixed(2)}/month</p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center">
                    <Calendar size={20} className="text-gray-400 mr-2" />
                    <span>Renews on {formatDate(subscription.end_date)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Devices</h4>
                    <p className="text-gray-300">{subscription.plan.max_devices} devices</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">HD Quality</h4>
                    <p className="text-gray-300">{subscription.plan.hd_available ? "Available" : "Not available"}</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Ultra HD</h4>
                    <p className="text-gray-300">
                      {subscription.plan.ultra_hd_available ? "Available" : "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
                    Cancel Subscription
                  </button>

                  <button className="ml-4 bg-transparent border border-gray-600 hover:border-gray-500 text-white px-4 py-2 rounded-lg transition">
                    Billing History
                  </button>
                </div>
              </div>
            )}

            {/* Available Plans */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Available Plans</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availablePlans.map((plan) => (
                  <div
                    key={plan.plan_id}
                    className={`border rounded-lg p-6 ${
                      subscription && plan.plan_id === subscription.plan.plan_id
                        ? "border-red-500 bg-red-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{plan.plan_name}</h3>
                    <p className="text-2xl font-bold mb-4">
                      ${plan.price.toFixed(2)}
                      <span className="text-sm text-gray-400">/month</span>
                    </p>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                        <span>
                          {plan.max_devices} {plan.max_devices === 1 ? "device" : "devices"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                        <span>{plan.hd_available ? "HD video quality" : "Standard video quality"}</span>
                      </li>
                      <li className="flex items-start">
                        {plan.ultra_hd_available ? (
                          <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <span className="w-[18px] mr-2" />
                        )}
                        <span className={plan.ultra_hd_available ? "" : "text-gray-500"}>
                          {plan.ultra_hd_available ? "Ultra HD available" : "Ultra HD not available"}
                        </span>
                      </li>
                    </ul>

                    {subscription && plan.plan_id === subscription.plan.plan_id ? (
                      <button
                        className="w-full bg-red-600 text-white py-2 rounded-lg font-medium cursor-default"
                        disabled
                      >
                        Current Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.plan_id)}
                        disabled={upgrading}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                      >
                        {upgrading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : subscription && plan.price > subscription.plan.price ? (
                          "Upgrade"
                        ) : (
                          "Switch Plan"
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Payment Method
                </h3>

                <div className="flex items-center">
                  <div className="bg-gray-800 rounded p-2 mr-3">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-400">Expires 12/25</p>
                  </div>
                  <button className="ml-auto text-red-500 hover:text-red-400 text-sm">Change</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserSubscription

