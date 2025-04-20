import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Icons
import {
  Clapperboard,
  Calendar,
  FileText,
  Clock,
  UploadCloud,
  Save,
  XCircle,
  Search,
  Star,
} from "lucide-react";

// Components
import AdminSidebar from "../../components/AdminSidebar";
import GoBackButton from "../../components/GoBackButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AddNewMovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    release_year: "",
    poster: "",
    is_available: true,
    description: "",
    duration: "",
    imdb_id: "",
    rating: "",
  });

  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([
    { title: "Inception", poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg", rating: "8.8" },
    { title: "Pulp Fiction", poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", rating: "9.0" },
    { title: "The Godfather", poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", rating: "9.0" },
  ]);

  const isFormDirty = () =>
    Object.values(form).some(
      (v) => v !== "" && v !== true && v !== false && v !== 0
    ) || movieFile !== null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name === "release_year" || name === "duration") {
      if (/^\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMovieFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v.toString())
      );
      if (movieFile) formData.append("file", movieFile);

      await axios.post(`${API_URL}/api/admin/movies`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Movie added!");
      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      alert("Error adding movie");
    }
  };

  const handleCancel = () => {
    if (isFormDirty()) {
      const confirmLeave = confirm("You have unsaved changes. Are you sure?");
      if (!confirmLeave) return;
    }
    navigate("/admin/movies");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== "") {
      setRecommendedMovies([]); // Replace this with TMDB API call later
    } else {
      setRecommendedMovies([
        { title: "Inception", poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg", rating: "8.8" },
        { title: "Pulp Fiction", poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", rating: "9.0" },
        { title: "The Godfather", poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", rating: "9.0" },
      ]);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        {/* Go Back */}
        <div className="mb-2">
          <GoBackButton
            onClick={() => {
              if (isFormDirty()) {
                const confirmLeave = confirm("You have unsaved changes. Are you sure?");
                if (!confirmLeave) return;
              }
              navigate(-1);
            }}
            className="text-sm text-gray-300 hover:text-white underline"
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-8 text-center">Add New Movie</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clapperboard size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Genre */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Release Year */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Release Year</label>
                <input
                  type="text"
                  name="release_year"
                  value={form.release_year}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Duration (min)</label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Rating (0.0 - 10.0)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Star size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    placeholder="Enter a rating between 0.0 and 10.0"
                  />
                </div>
              </div>

              {/* Upload Movie File */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Upload Movie File</label>
                <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-6">
                  <div className="flex justify-center items-center">
                    <UploadCloud size={24} className="text-gray-500 mr-3" />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <p className="text-gray-400">Drag & drop or click to select a file</p>
                  </div>
                </div>
                {movieFile && (
                  <div className="mt-2 p-4 bg-gray-700 rounded-lg flex items-center space-x-2">
                    <FileText size={18} className="text-gray-300" />
                    <p className="text-gray-300">{movieFile.name}</p>
                  </div>
                )}
              </div>

              {/* Save / Cancel Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save Movie
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Recommended/Search Section */}
          <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Search Movies</h2>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search for a movie..."
                className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          

            {/* Recommended Movies */}
            {searchQuery === "" && recommendedMovies.length > 0 && (
              <div>
                <h3 className="text-lg text-white mb-4">Recommended Movies</h3>
                <div className="grid grid-cols-2 gap-4">
                {recommendedMovies.map((movie, idx) => (
                  <div key={idx} className="flex items-center bg-gray-700 p-3 rounded-lg">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded mr-4"
                    />
                    <div className="space-y-1">
                      <p className="text-white font-medium">{movie.title}</p>
                      <div className="flex items-center text-yellow-400 text-sm">
                        <Star size={14} className="mr-2" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewMovie;