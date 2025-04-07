import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Film,
  CreditCard,
  Ticket,
  Settings,
  ChevronRight,
} from "lucide-react";
import React from "react";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/users", icon: <Users size={20} />, label: "Users" },
    { path: "/admin/movies", icon: <Film size={20} />, label: "Content" },
    {
      path: "/admin/subscriptions",
      icon: <Ticket size={20} />,
      label: "Subscriptions",
    },
    {
      path: "/admin/billing",
      icon: <CreditCard size={20} />,
      label: "Billing",
    },
    {
      path: "/admin/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <div className="bg-gray-950 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="text-red-600 mr-2">SHM</span> Admin
        </h2>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
        <Link
          to="/"
          className="text-gray-400 hover:text-white text-sm flex items-center p-3"
        >
          <span>Back to Main Site</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
