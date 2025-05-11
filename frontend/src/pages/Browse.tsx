"use client";

import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search } from "lucide-react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [yearRange, setYearRange] = useState("");

  const genres = [
    "Action", "Comedy", "Drama", "Sci-Fi", "Horror",
    "Romance", "Thriller", "Animation",
  ];

  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const decadeRanges: string[] = [];

  for (let year = startYear; year < currentYear; year += 10) {
    const end = Math.min(year + 10, currentYear);
    decadeRanges.push(`${year}-${end}`);
  }
  
  const sortedDecadeRanges = decadeRanges.reverse();

  const fetchMovies = useCallback(async (search: string, genre: string, year: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (genre) params.genre = genre;
      if (year) {
        const [start, end] = year.split("-");
        if (start && end) {
          params["release_year>"] = parseInt(start);
          params["release_year<"] = parseInt(end);
        }
      }


      const response = await axios.get(`${API_URL}/movies`, { params });
      console.log("Fetching movies with params:", params);

      setMovies(response.data.rows);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(searchTerm, genre, yearRange);
  }, [searchTerm, genre, yearRange, fetchMovies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value);
  };

  const handleYearRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearRange(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setGenre("");
    setYearRange("");
    fetchMovies("", "", "");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Movies</h1>

      {/* Search & Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
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
              value={yearRange}
              onChange={handleYearRangeChange}
            >
              <option value="">All Years</option>
              {sortedDecadeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
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
            <h2 className="text-xl font-semibold">
              {searchTerm || genre || yearRange ? "Search Results" : "All Movies"}
            </h2>
            <p className="text-gray-400">{movies.length} movies found</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Browse;
