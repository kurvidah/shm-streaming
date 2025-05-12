"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `/api/v1`;

const AdminMovies = () => {
  const navigate = useNavigate();
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [editedMovie, setEditedMovie] = useState<any>({});


  const [movies, setMovies] = useState<
    {
      movie_id: number;
      title: string;
      poster: string;
      release_year: number;
      genre: string;
      is_available: boolean;
      slug: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // fetch from real API if available
        const response = await axios.get(`${API_URL}/admin/movies`);
        setMovies(response.data.rows);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (searchQuery) => {
    setSearchTerm(searchQuery);
    try {
      const response = await axios.get(`${API_URL}/movies?search=${searchQuery}`);
      setMovies(response.data.rows); // assuming API returns an array of movie objects
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };  

  const handleDeleteMovie = async (selectedMovieID: number) => {
    if (window.confirm(`This action is irreversible. Are you sure you want to delete a movie ID: ${selectedMovieID}?`)){
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`${API_URL}/admin/movies/${selectedMovieID}`);
        setMovies(movies.filter((movie) => movie.movie_id !== selectedMovieID));
        setLoading(false);

      } catch (err: any) {
        console.error(`Error deleting a plan witth ID ${selectedMovieID}:`, err.message);
        setError(`Failed to delete plan with ID ${selectedMovieID}`);
        setLoading(false);

      }
    }
  };

  const handleEditClick = (movie: any) => {
    if (editingMovieId === movie.movie_id) {
      setEditingMovieId(null);
      setEditedMovie({});
    } else {
      setEditingMovieId(movie.movie_id);
      setEditedMovie({ ...movie });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedMovie((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/admin/movies/${editingMovieId}`, editedMovie);
      setMovies((prev) =>
        prev.map((movie) =>
          movie.movie_id === editingMovieId ? { ...movie, ...editedMovie } : movie
        )
      );
      setEditingMovieId(null);
      setEditedMovie({});
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMovieId(null);
    setEditedMovie({});
  };


  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition"
            onClick={() => navigate("/admin/movies/add")}
          >
            <Plus size={20} className="mr-2" />
            Add New Movie
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
            {error}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-grey-700">
                {movies.map((movie) => (
                  <React.Fragment key={movie.movie_id}>
                    <tr className="bg-gray-750 hover:bg-gray-700 ">
                      {/* แสดงแถวหลักของหนัง */}
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/admin/movies/detail/${movie.movie_id}`)}>
                        <div className="flex items-center">
                          <img
                            src={movie.poster || "/placeholder.svg"}
                            alt={movie.title}
                            className="h-10 w-7 object-cover rounded mr-3"
                          />
                          <div className="font-medium">{movie.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{movie.release_year}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{movie.genre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${movie.is_available ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                          {movie.is_available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white">
                            <Eye size={18} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-500" onClick={() => handleEditClick(movie)}>
                            <Edit size={18} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-500" onClick={() => handleDeleteMovie(movie.movie_id)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    
                    {editingMovieId === movie.movie_id && (
                      <tr className="bg-gray-900">
                        <td colSpan={5} className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm text-gray-300 mb-1">Title</label>
                              <input
                                type="text"
                                name="title"
                                value={editedMovie.title || ""}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white p-2 rounded"
                              />
                            </div>

                            <div className="flex flex-col">
                              <label className="text-sm text-gray-300 mb-1">Genre</label>
                              <select
                                name="genre"
                                value={editedMovie.genre || ""}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white p-2 rounded"
                              >
                                <option value="">Select genre</option>
                                <option value="Action">Action</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Drama">Drama</option>
                                <option value="Sci-Fi">Sci-Fi</option>
                                <option value="Horror">Horror</option>
                                <option value="Romance">Romance</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Animation">Animation</option>
                              </select>
                            </div>

                            <div className="flex flex-col">
                              <label className="text-sm text-gray-300 mb-1">Release Year</label>
                              <input
                                type="number"
                                name="release_year"
                                value={editedMovie.release_year || ""}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white p-2 rounded"
                              />
                            </div>

                            <div className="flex flex-col">
                              <label className="text-sm text-gray-300 mb-1">Duration (minutes)</label>
                              <input
                                type="number"
                                name="duration"
                                value={editedMovie.duration || ""}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white p-2 rounded"
                              />
                            </div>

                            <div className="flex flex-col col-span-2">
                              <label className="text-sm text-gray-300 mb-1">Description</label>
                              <textarea
                                name="description"
                                value={editedMovie.description || ""}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white p-2 rounded w-full h-32 resize-none"
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-red-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>

                    )}
                  </React.Fragment>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovies;
