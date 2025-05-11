"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import UserSidebar from "../../components/UserSidebar"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Link } from "react-router-dom"
import { Clock, Trash2, AlertCircle, Play } from "lucide-react"

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

const UserWatchHistory = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        setLoading(true)

        // In a real app, you would fetch this data from your API
        // const response = await axios.get(`/api/watch-history/`);
        // setHistory(response.data);

        // For demo purposes
        setTimeout(() => {
          setHistory([
            {
              id: 1,
              movie: {
                movie_id: 1,
                title: "The Matrix",
                poster:
                  "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
                duration: 136,
                slug: "the-matrix",
              },
              timestamp: "2025-03-15T14:30:00Z",
              watch_duration: 120,
            },
            {
              id: 2,
              movie: {
                movie_id: 2,
                title: "Inception",
                poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
                duration: 148,
                slug: "inception",
              },
              timestamp: "2025-03-10T20:15:00Z",
              watch_duration: 148,
            },
            {
              id: 3,
              movie: {
                movie_id: 3,
                title: "The Godfather",
                poster:
                  "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
                duration: 175,
                slug: "the-godfather",
              },
              timestamp: "2025-03-05T19:00:00Z",
              watch_duration: 100,
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error fetching watch history:", err)
        setError("Failed to load watch history")
        setLoading(false)
      }
    }

    fetchWatchHistory()
  }, [])

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

          {history.length > 0 && (
            <button className="text-gray-400 hover:text-white flex items-center">
              <Trash2 size={18} className="mr-2" />
              Clear History
            </button>
          )}
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
                      <button
                        onClick={() => handleRemoveFromHistory(item.id)}
                        className="text-gray-500 hover:text-red-500 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
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

