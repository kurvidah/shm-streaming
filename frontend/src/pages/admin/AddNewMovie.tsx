import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import GoBackButton from "../../components/GoBackButton";
import { Clapperboard, Calendar, FileText, Clock, Film, Save, XCircle } from "lucide-react";

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
  });

  const isFormDirty = () => {
    return Object.values(form).some(
      (value) => value !== "" && value !== true && value !== false && value !== 0
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/movies`, {
        ...form,
        release_year: parseInt(form.release_year),
        duration: parseInt(form.duration),
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
      const confirmLeave = confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmLeave) return;
    }
    navigate("/admin/movies");
  };

  return (
    <div className="flex">
      <AdminSidebar />

        <div className="mb-2 p-8">
          <GoBackButton 
          onClick={() => {
            if (isFormDirty()) {
              const confirmLeave = confirm("You have unsaved changes. Are you sure you want to go back?");
              if (!confirmLeave) return;
            }
            navigate(-1);
          }}
          className="text-sm text-gray-300 hover:text-white underline"
          />
        </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Add New Movie</h1>

        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* Title */}
              <div>
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
              <div>
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

              {/* Release year */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Release Year</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="release_year"
                    value={form.release_year}
                    onChange={handleChange}
                    // placeholder="e.g., 2022"
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Duration (min)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    // placeholder="e.g., 120"
                    className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* IMDB id */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">IMDB ID</label>
                <input
                  type="text"
                  name="imdb_id"
                  value={form.imdb_id}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., tt1234567"
                />
              </div>

              {/* Poster Url*/}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Poster URL</label>
                <input
                  type="text"
                  name="poster"
                  value={form.poster}
                  onChange={handleChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-gray-400 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter movie description"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center mb-8">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-white">Available</label>
            </div>

            {/* Submit and Cancel buttons */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center"
              >
                <Save size={20} className="mr-2" />
                Submit
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center"
              >
                <XCircle size={20} className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewMovie;
