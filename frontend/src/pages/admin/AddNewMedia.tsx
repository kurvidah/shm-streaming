// src/pages/AddNewMedia.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from "axios";

const API_URL = `/api/v1`;

const AddNewMedia: React.FC = () => {
  const navigate = useNavigate();
  const movieID = useParams().movieID;

  const [episode, setEpisode] = useState("");
  const [season, setSeason] = useState("");
  const [description, setDescription] = useState("");
  const [filePath, setFilePath] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    setLoading(true);
    setError(null);

    const mediaData = {
    //   movie_id: parseInt(movieID || "0", 10),
      episode: parseInt(episode, 10),
      season: parseInt(season, 10),
      description,
      file_path: filePath,
      status,
    };

    try {
      await axios.post(`${API_URL}/admin/media`, mediaData);
      navigate(`/admin/movies/detail/${movieID}`);
    } catch (err: any) {
      console.error("Error adding media:", err.response?.data || err.message);
      setError("Failed to add media. Please try again.");
    } 
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex">
        <AdminSidebar />
        <div className="min-h-screen bg-[#121826] text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-[#1E293B] p-8 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Add New Media</h2>
                {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 rounded p-3">
                    {error}
                </div>
                )}
                {loading ? (
                <LoadingSpinner />
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1">Season</label>
                        <input
                        type="number"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="w-full bg-[#334155] text-white px-4 py-2 rounded-md"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Episode</label>
                        <input
                        type="number"
                        value={episode}
                        onChange={(e) => setEpisode(e.target.value)}
                        className="w-full bg-[#334155] text-white px-4 py-2 rounded-md"
                        required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-1">Description</label>
                        <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#334155] text-white px-4 py-2 rounded-md"
                        required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-1">File Path</label>
                        <input
                        type="text"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        className="w-full bg-[#334155] text-white px-4 py-2 rounded-md"
                        placeholder="/media/season2/ep3.mp4"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-[#334155] text-white px-4 py-2 rounded-md"
                        required
                        >
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                        </select>
                    </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition"
                    >
                        Add Media
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition"
                    >
                        Cancel
                    </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    </div>
  );
};

export default AddNewMedia;
