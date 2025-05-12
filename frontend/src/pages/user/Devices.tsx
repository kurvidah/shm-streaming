"use client"

import { Smartphone, Laptop, AlertCircle, Tv, Trash2 } from "lucide-react";
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"


const API_URL = `/api/v1`;

interface Device {
  device_id: number
  device_type: string
  device_name: string
}

const UserDevices = () => {
  const { user } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true)

        const response = await axios.get(`${API_URL}/users`)

        setDevices(response.data.devices)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching devices:", err)
        setError("Failed to load devices")
        setLoading(false)
      }
    }

    fetchDevices()
  }, [])  

  const handleRemoveDevice = async (deviceId: number) => {
    try {
      setRemoving(deviceId)

      await axios.delete(`${API_URL}/users?device_id=${deviceId}`)

      setDevices(devices.filter((device) => device.device_id !== deviceId))
      setRemoving(null)
    } catch (err) {
      console.error("Error removing device:", err)
      setRemoving(null)
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "phone":
        return <Smartphone size={24} />;  
      case "Desktop":
        return <Laptop size={24} />;  
      case "tv":
        return <Tv size={24} />;  
      default:
        return <Smartphone size={24} />;  
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">My Devices</h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Registered Devices</h2>
                <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">{devices.length} / 3 devices</span>
              </div>

              <p className="text-gray-400 mb-6">
                Your subscription allows you to register up to 3 devices. You can remove devices to register new ones.
              </p>

              {devices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No devices registered yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div
                      key={device.device_id}
                      className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-600 p-3 rounded-lg mr-4 text-xl">{getDeviceIcon(device.device_type)}</div>
                        <div>
                          <h3 className="font-semibold">{device.device_name}</h3>
                          <p className="text-sm text-gray-400">
                            {device.device_type} • Registered on {formatDate(device.registered_at)}
                          </p>
                        </div>
                      </div>

                      {/*<button
                        onClick={() => handleRemoveDevice(device.device_id)}
                        disabled={removing === device.device_id}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition disabled:opacity-50"
                      >
                        {removing === device.device_id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>*/}

                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Add New Device</h2>

              {devices.length >= 3 ? (
                <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg p-4 mb-4">
                  <p>
                    You have reached the maximum number of devices for your subscription plan. Please remove a device
                    before adding a new one.
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 mb-6">
                  To add a new device, sign in to your account on that device. The device will be automatically
                  registered.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <Smartphone size={32} className="mx-auto mb-2" />
                  <h3 className="font-semibold">Mobile</h3>
                  <p className="text-sm text-gray-400 mt-1">iOS, Android</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <Laptop size={32} className="mx-auto mb-2" />
                  <h3 className="font-semibold">Computer</h3>
                  <p className="text-sm text-gray-400 mt-1">Windows, Mac, Linux</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <Tv size={32} className="mx-auto mb-2" />
                  <h3 className="font-semibold">Smart TV</h3>
                  <p className="text-sm text-gray-400 mt-1">Samsung, LG, Android TV</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserDevices
