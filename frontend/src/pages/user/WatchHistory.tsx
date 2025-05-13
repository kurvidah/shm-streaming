"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Link } from "react-router-dom"
import { Clock, Trash2, AlertCircle, Play } from "lucide-react"
import axios from "axios"

interface WatchHistoryItem {
  id: number
  movie: {
    movie_id: number
    title: string
    poster: string
    duration: number
    slug: string
  }
  timestamp: string
  watch_duration: number
}

const API_URL = `/api/v1`

const UserWatchHistory = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/watch-history`)
        const rows = res.data.rows

        const mapped = rows.map((item: any) => ({
          id: item.media_id,
          movie: {
            movie_id: item.media_id,
            title: item.title,
            poster: item.poster,
            duration: item.duration || 100, 
            slug: item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""), // create slug
          },
          timestamp: item.watched_at,
          watch_duration: item.watch_duration,
        }))

        setHistory(mapped)
      } catch (err) {
        console.error("Error fetching watch history:", err)
        setError("Failed to load watch history")
      } finally {
        setLoading(false)
      }
    }


    if (user) {
      fetchWatchHistory()
    }
  }, [user])

  const handleRemoveFromHistory = (id: number) => {
    setHistory(history.filter((item) => item.id !== id))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateProgress = (watched: number, total: number) => {
    return Math.min(Math.round((watched / total) * 100), 100)
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Watch History</h1>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Clock size={48} className="mx-auto text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Watch History</h2>
            <p className="text-gray-400 mb-6">You haven't watched any movies or TV shows yet.</p>
            <Link
              to="/browse"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto relative">
                  <img
                    src={item.movie.poster || "/placeholder.svg"}
                    alt={item.movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Link
                      to={`/watch/${item.movie.movie_id}`}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                    >
                      <Play size={24} />
                    </Link>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/movie/${item.movie.slug}`}
                        className="text-lg font-semibold hover:text-red-500 transition"
                      >
                        {item.movie.title}
                      </Link>

                    </div>

                    <p className="text-gray-400 text-sm mt-1">Watched on {formatDate(item.timestamp)}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{calculateProgress(item.watch_duration, item.movie.duration)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${calculateProgress(item.watch_duration, item.movie.duration)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserWatchHistory
