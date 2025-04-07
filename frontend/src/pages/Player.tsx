"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import axios from "axios";
import React from "react";

const Player = () => {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movieData, setMovieData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/movies/${id}/`
        );
        setMovieData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to load movie data");
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  useEffect(() => {
    if (!loading && movieData && videoRef.current) {
      const videoElement = videoRef.current;

      // Check if the stream URL is HLS format
      if (movieData.stream_url.includes(".m3u8")) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(movieData.stream_url);
          hls.attachMedia(videoElement);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement
              .play()
              .catch((e) => console.error("Error playing video:", e));
          });

          // Clean up HLS instance on unmount
          return () => {
            hls.destroy();
          };
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          // For Safari which has native HLS support
          videoElement.src = movieData.stream_url;
          videoElement.addEventListener("loadedmetadata", () => {
            videoElement
              .play()
              .catch((e) => console.error("Error playing video:", e));
          });
        }
      } else {
        // For regular video formats
        videoElement.src = movieData.stream_url;
        videoElement
          .play()
          .catch((e) => console.error("Error playing video:", e));
      }
    }
  }, [loading, movieData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="relative flex-1">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          playsInline
          poster={movieData?.thumbnail_url}
        />
      </div>

      {movieData && (
        <div className="p-4 bg-gray-900">
          <h1 className="text-2xl font-bold mb-2">{movieData.title}</h1>
          <p className="text-gray-400 mb-4">{movieData.description}</p>
          <div className="flex space-x-4">
            <span className="bg-gray-800 px-2 py-1 rounded text-sm">
              {movieData.year}
            </span>
            <span className="bg-gray-800 px-2 py-1 rounded text-sm">
              {movieData.duration} min
            </span>
            <span className="bg-gray-800 px-2 py-1 rounded text-sm">
              {movieData.rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
