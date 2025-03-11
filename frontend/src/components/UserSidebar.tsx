import { Link, useLocation } from "react-router-dom"
import { User, Clock, CreditCard, Smartphone, Settings, ChevronRight } from "lucide-react"

const UserSidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const menuItems = [
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/subscription", icon: <CreditCard size={20} />, label: "Subscription" },
    { path: "/history", icon: <Clock size={20} />, label: "Watch History" },
    { path: "/devices", icon: <Smartphone size={20} />, label: "Devices" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ]

  return (
    <div className="bg-gray-900 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">My Account</h2>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive(item.path) ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isActive(item.path) && <ChevronRight size={16} />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800 mt-8">
        <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center p-3">
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default UserSidebar

