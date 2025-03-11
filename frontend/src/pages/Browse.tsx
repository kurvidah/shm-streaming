"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { Search } from "lucide-react"

const Browse = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [genre, setGenre] = useState("")
  const [year, setYear] = useState("")

  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Thriller", "Animation"]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (searchTerm) params.append("search", searchTerm)
        if (genre) params.append("genre", genre)
        if (year) params.append("release_year", year)

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/?${params.toString()}`)
        setMovies(response.data.results || response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching movies:", err)
        setError("Failed to load movies")
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchMovies()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, genre, year])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setGenre("")
    setYear("")
  }

  // For demo purposes, if API doesn't return data
  const demoMovies = movies.length
    ? movies
    : [
        {
          movie_id: 1,
          title: "The Matrix",
          poster:
            "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
          release_year: 1999,
          genre: "Sci-Fi",
          slug: "the-matrix",
        },
        {
          movie_id: 2,
          title: "Inception",
          poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
          release_year: 2010,
          genre: "Sci-Fi",
          slug: "inception",
        },
        {
          movie_id: 3,
          title: "The Godfather",
          poster:
            "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
          release_year: 1972,
          genre: "Crime",
          slug: "the-godfather",
        },
        {
          movie_id: 4,
          title: "Pulp Fiction",
          poster:
            "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
          release_year: 1994,
          genre: "Crime",
          slug: "pulp-fiction",
        },
        {
          movie_id: 5,
          title: "The Dark Knight",
          poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
          release_year: 2008,
          genre: "Action",
          slug: "the-dark-knight",
        },
        {
          movie_id: 6,
          title: "Forrest Gump",
          poster:
            "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
          release_year: 1994,
          genre: "Drama",
          slug: "forrest-gump",
        },
      ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Movies</h1>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={genre}
              onChange={handleGenreChange}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              className="bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={year}
              onChange={handleYearChange}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="bg-gray-700 text-white rounded-lg px-4 py-3 hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <p>Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{searchTerm || genre || year ? "Search Results" : "All Movies"}</h2>
            <p className="text-gray-400">{demoMovies.length} movies found</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {demoMovies.map((movie) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Browse

