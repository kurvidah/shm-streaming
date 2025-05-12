"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Check, AlertCircle, Receipt } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`

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
  const navigate = useNavigate()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null)
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  const [paymentInfo, setPaymentInfo] = useState<{
      amount: number
      due_date: string
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch plans
        const res = await axios.get(`${API_URL}/plans`)
        const data = res.data

        const mappedPlans: SubscriptionPlan[] = data.rows.map((plan: any) => ({
          plan_id: plan.plan_id,
          plan_name: plan.plan_name,
          price: plan.price,
          max_devices: plan.max_devices,
          hd_available: !!plan.hd_available,
          ultra_hd_available: !!plan.ultra_hd_available,
          duration_days: plan.duration_days,
        }))

        setAvailablePlans(mappedPlans)

        // 2. Fetch subscription
        const subRes = await axios.get(`${API_URL}/subscribe`)
        const sub = subRes.data[0]
        console.log("Subscription", sub)

        {/*if (!sub || !sub.plan_id) {
          setError("No active subscription found.")
          return
        }*/}

        const plan = mappedPlans.find(p => p.plan_id === sub.plan_id)
        if (!plan) {
          setError("Your subscription plan no longer exists.")
          return
        }

        setSubscription({
          user_subscription_id: sub.user_subscription_id,
          plan,
          start_date: sub.start_date,
          end_date: sub.end_date,
        })

        // 3. Fetch payments
        const payRes = await axios.get(`${API_URL}/payment`)
        const allPayments = payRes.data

        const userPayment = allPayments.find((p: any) => p.billing_id === sub.billing_id)
        if (userPayment && userPayment.due_date && !isNaN(new Date(userPayment.due_date).getTime())) {
          setPaymentInfo({
            amount: userPayment.amount ?? 0,
            due_date: userPayment.due_date,
          })
        } else {
          setPaymentInfo(null)
        }

      } catch (err: any) {
        setError("Failed to load subscription or payment information.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleUpgrade = async (planId: number) => {
  setUpgrading(true)
  setError(null)

  // ตรวจสอบว่า subscription ยังไม่หมดอายุ
  if (subscription && new Date(subscription.end_date) > new Date()) {
    setError("You cannot upgrade your plan until your current plan expires.")
    setUpgrading(false)
    setTimeout(() => {
      navigate("/subscription")  // หรือเส้นทางที่ต้องการ
    }, 1000)
    return 
  }

  try {
    const res = await axios.put(`${API_URL}/subscribe?plan_id=${planId}`)
    const data = res.data

    const newPlan = availablePlans.find(p => p.plan_id === parseInt(data.subscription.plan_id))

    if (newPlan) {
      setSubscription({
        user_subscription_id: data.subscription.user_subscription_id,
        plan: newPlan,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + newPlan.duration_days * 86400000).toISOString(),
      })

      // 🔺 Navigate to billing page after subscription success
      navigate("/billing")
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to subscribe to the selected plan.")
  } finally {
    setUpgrading(false)
  }
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
            {/* Billing Section */}
            <div className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                Billing Invoice
              </h3>
              <div className="flex items-center">
                <div className="bg-gray-700 rounded p-2 mr-3">
                  <Receipt size={24} />
                </div>
                <div>
                  <p className="font-medium">
                    Amount Due: {paymentInfo ? `${paymentInfo.amount.toFixed(2)}` : "-"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Due Date:{" "}
                    {paymentInfo
                      ? new Date(paymentInfo.due_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <button
                  className="ml-auto text-red-500 hover:text-red-400 text-sm hover:underline"
                  onClick={() => navigate("/billing")}
                >
                  Pay Now
                </button>
              </div>
            </div>


            {/* Plans */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Choose Your Plan</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availablePlans.map((plan) => {
                  const isCurrent = subscription?.plan?.plan_id === plan.plan_id

                  return (
                    <div
                      key={plan.plan_id}
                      className={`rounded-lg p-6 transition shadow border-2 ${
                        isCurrent
                          ? "border-red-500 bg-red-500/10"
                          : "border-gray-700 hover:border-red-400"
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

                      {subscription && isCurrent ? (
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
                          {upgrading
                            ? "Processing..."
                            : subscription
                              ? plan.price > subscription.plan.price
                                ? "Upgrade"
                                : "Downgrade"
                              : "Choose Plan"}
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
