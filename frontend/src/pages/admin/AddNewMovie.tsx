import React, { useState } from "react";
import { useNavigate , useRouter } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import { ArrowLeft } from 'lucide-react'; // optional icon library
import GoBackButton from '../../components/GoBackButton';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AddNewMovie = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    genre: "",
    release_year: "",
    poster: "",
    is_available: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

   
    if (name === "release_year") {
      if (/^\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, release_year: value }));
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
      await axios.post(`${API_URL}/api/admin/movies`, form);
      alert("Movie added!");
      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      alert("Error adding movie");
    }
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      useRouter().back(); // goes to the previous page
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
      <GoBackButton onClick={handleGoBack} variant="ghost" className="flex items-center gap-2">
      </GoBackButton>
        <h2 className="text-3xl font-bold text-white mb-6">Add New Movie</h2>

        <div className="max-w-xl p-6 bg-gray-800 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              name="release_year"
              placeholder="Release Year"
              value={form.release_year}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              name="poster"
              placeholder="Poster URL"
              value={form.poster}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="mr-2"
              />
              Available
            </label>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewMovie;
