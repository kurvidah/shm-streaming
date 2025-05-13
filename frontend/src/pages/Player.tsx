"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

const Player = () => {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movieData, setMovieData] = useState<any>(null);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [canPlay, setCanPlay] = useState(false); // Add a flag to control when the video can play
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/media/${id}/meta`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMovieData(response.data);
        setStartMinute(response.data.watch_duration || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching media metadata:", err);
        setError("Failed to load media");
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [id]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !movieData || loading || !canPlay) return;

    const fetchStream = async () => {
      try {
        videoElement.src = `/api/v1/media/${id}?token=${localStorage.getItem("token")}&range-minutes=${startMinute}-`;

        // Listen for 'canplay' event to ensure the video is ready before playing
        videoElement.addEventListener("canplay", () => {
          videoElement
            .play()
            .then(() => {
              console.log("Video started playing");
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              setError("Playback error");
            });
        });
      } catch (err) {
        console.error("Error loading video stream:", err);
        setError("Playback error");
      }
    };

    fetchStream();
  }, [movieData, startMinute, loading, canPlay]);

  const handleWatchEnd = async () => {
    try {
      const currentTimeMinutes = videoRef.current?.currentTime
        ? videoRef.current.currentTime / 60
        : 0;

      await axios.post(
        `/api/media/${id}/watch-end`,
        { watched: currentTimeMinutes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to send watch-end:", err);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onBeforeUnload = () => handleWatchEnd();

    window.addEventListener("beforeunload", onBeforeUnload);
    video.addEventListener("pause", handleWatchEnd);
    video.addEventListener("ended", handleWatchEnd);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      video.removeEventListener("pause", handleWatchEnd);
      video.removeEventListener("ended", handleWatchEnd);
    };
  }, []);

  const handlePlayButtonClick = () => {
    setCanPlay(true); // Allow the video to start playing once the user clicks
  };

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
    <div className="flex flex-col h-screen bg-black text-white">

      {movieData && (
        <div className="p-6 bg-gray-900">
          <h1 className="text-3xl font-bold mb-4">Description: {movieData.title}</h1>
          
          <div className="flex justify-between items-start">
            {/* Left Side - Description */}
            <p className="text-gray-300 max-w-3xl leading-relaxed">
              <span className="text-2xl text-gray-400">
                {movieData.description || "No description available."}
              </span>
            </p>

            {/* Right Side - Button */}
            <div>
              <button
                onClick={handlePlayButtonClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Start Watching
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Video section - centered */}
      <div className="flex-1 flex items-center justify-center h-full bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          controls
          playsInline
          poster={movieData?.thumbnail_url}
        />
      </div>

    </div>

  );
};

export default Player;
