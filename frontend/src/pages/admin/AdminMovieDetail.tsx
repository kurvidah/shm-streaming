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
                            <tr key={m.media_id}>
                            <td className="px-6 py-4">{m.season}</td>
                            <td className="px-6 py-4">{m.episode}</td>
                            <td className="px-6 py-4">{m.description}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                m.status === "APPROVED"
                                    ? "bg-green-500/20 text-green-500"
                                    : m.status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-red-500/20 text-red-500"
                                }`}>
                                {m.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                <button className="p-1 text-gray-400 hover:text-white">
                                    <Eye size={18} />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-blue-500">
                                    <Edit size={18} />
                                </button>
                                <button
                                    className="p-1 text-gray-400 hover:text-red-500"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMovie(m.media_id);
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                                </div>
                            </td>
                            </tr>
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