"use client"

import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="bg-black py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-red-600 font-bold text-2xl">
          SHM Streaming
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-red-500 transition">
            Home
          </Link>
          <Link to="/browse" className="text-white hover:text-red-500 transition">
            Browse
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center text-white hover:text-red-500 transition"
              >
                <span className="mr-2">{user.username}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/subscription"
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Subscription
                  </Link>
                  <Link
                    to="/history"
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Watch History
                  </Link>
                  {user.id === 1 && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-red-500 transition">
                Login
              </Link>
              <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-md shadow-lg py-2 px-4">
          <Link
            to="/"
            className="block py-2 text-white hover:text-red-500 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className="block py-2 text-white hover:text-red-500 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="block py-2 text-white hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/subscription"
                className="block py-2 text-white hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Subscription
              </Link>
              <Link
                to="/history"
                className="block py-2 text-white hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Watch History
              </Link>
              {user.id === 1 && (
                <Link
                  to="/admin"
                  className="block py-2 text-white hover:text-red-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left py-2 text-white hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block py-2 text-white hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 text-white hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

