"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `/api/v1`;

const AdminMoviesDetail = () =>{
    const navigate = useNavigate();
    const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
    const [editedMedia, setEditedMedia] = useState<any>({});


    const [movie, setMovie] = useState<null | {
        movie_id: number;
        title: string;
        description: string;
        release_year: number;
        duration: number;
        is_available: number;
        imdb_id: string;
        poster: string;
        slug: string;
        rating: string;
        genres: string[];
        views: number;
        media: {
            media_id: number;
            movie_id: number;
            episode: number;
            season: number;
            description: string;
            upload_date: string;
            file_path: string;
            status: string;
        }[];
    }>(null);

    const movieId = useParams().movieID;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
            const fetchMedia = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/admin/movies/${movieId}`);
                setMovie(response.data);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching movie:", err);
                setError("Failed to load movie details.");
                setLoading(false);
            }
            };
        
            if (movieId) fetchMedia();
        }, [movieId]);
        

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDeleteMedia = async (selectedMediaID: number) => {
        if (window.confirm(`This action is irreversible. Are you sure you want to delete a media ID: ${selectedMediaID}?`)){
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`${API_URL}/admin/media/${selectedMediaID}`);
    
            setMovie(prev => prev ? {
                ...prev,
                media: prev.media.filter(m => m.media_id !== selectedMediaID)
            } : prev);  // check if prev (the previous state) is not null. if it is null, just return prev (don't update anything).
            setLoading(false);
    
        } catch (err: any) {
            console.error(`Error deleting a plan witth ID ${selectedMediaID}:`, err.message);
            setError(`Failed to delete plan with ID ${selectedMediaID}`);
            setLoading(false);
    
        }
        }
    };

    const handleEditClick = (media: any) => {
    if (editingMediaId === media.media_id) {
        setEditingMediaId(null);
        setEditedMedia({});
    } else {
        setEditingMediaId(media.media_id);
        setEditedMedia({ ...media });
    }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedMedia((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
    try {
        // You may want to send editedMedia to your API here
        setMovie((prev) => {
        if (!prev) return prev;
        return {
            ...prev,
            media: prev.media.map((m) =>
            m.media_id === editedMedia.media_id ? editedMedia : m
            ),
        };
        });
        setEditingMediaId(null);
        setEditedMedia({});
    } catch (err) {
        console.error("Error saving media edit:", err);
    }
    };



    return (
        <div className="flex">
            <AdminSidebar />
    
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Content Management</h1>
    
                <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition"
                    onClick={() => navigate(`/admin/movies/detail/${movieId}/addMedia`)}
                >
                    <Plus size={20} className="mr-2" />
                    Add New Media
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
                    onChange={handleSearch}
                    />
                </div>
                </div>
                {loading ? (
                <LoadingSpinner />
                ) : error ? (
                <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
                    {error}
                </div>
                ) : movie ? (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    {/* safe to access movie.media now */}
                    <table className="w-full">
                    <thead>
                        <tr className="bg-gray-900">
                        <th className="px-6 py-3">Season</th>
                        <th className="px-6 py-3">Episode</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-700">
                        {movie.media
                            .filter((m) =>
                            m.description.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((m) => (
                            <React.Fragment key={m.media_id}>
                                <tr>
                                <td className="px-6 py-4">{m.season}</td>
                                <td className="px-6 py-4">{m.episode}</td>
                                <td className="px-6 py-4">{m.description}</td>
                                <td className="px-6 py-4">
                                    <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        m.status === "APPROVED"
                                        ? "bg-green-500/20 text-green-500"
                                        : m.status === "PENDING"
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : "bg-red-500/20 text-red-500"
                                    }`}
                                    >
                                    {m.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                    <button
                                        className="p-1 text-gray-400 hover:text-white"
                                        onClick={() => handleEditClick(m)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        className="p-1 text-gray-400 hover:text-red-500"
                                        onClick={() => handleDeleteMedia(m.media_id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    </div>
                                </td>
                                </tr>

                                {editingMediaId === m.media_id && (
                                <tr className="bg-gray-700">
                                    <td colSpan={5} className="px-6 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                        <label className="text-sm text-gray-300">Season</label>
                                        <input
                                            type="number"
                                            name="season"
                                            value={editedMedia.season}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                                        />
                                        </div>
                                        <div>
                                        <label className="text-sm text-gray-300">Episode</label>
                                        <input
                                            type="number"
                                            name="episode"
                                            value={editedMedia.episode}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                                        />
                                        </div>
                                        <div className="sm:col-span-2">
                                        <label className="text-sm text-gray-300">Description</label>
                                        <textarea
                                            name="description"
                                            value={editedMedia.description}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 h-32 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 resize-y"
                                        />
                                        </div>
                                        <div>
                                        <label className="text-sm text-gray-300">Status</label>
                                        <select
                                            name="status"
                                            value={editedMedia.status}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                                        >
                                            <option value="APPROVED">APPROVED</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="REJECTED">REJECTED</option>
                                        </select>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button
                                        onClick={handleSaveEdit}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                        >
                                        Save
                                        </button>
                                        <button
                                        onClick={() => {
                                            setEditingMediaId(null);
                                            setEditedMedia({});
                                        }}
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
                ) : (
                <div className="text-gray-300">Movie not found.</div>
                )}


            </div>
            </div>
        );
};

export default AdminMoviesDetail;