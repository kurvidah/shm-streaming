"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { Play, Star, Clock, Calendar, Film } from "lucide-react";
import React from "react";

const MovieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/movies/${slug}/`
        );
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie details");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link to="/browse" className="text-blue-500 hover:underline">
          Back to Browse
        </Link>
      </div>
    );
  }

  // For demo purposes, if API doesn't return data
  const demoMovie = movie || {
    movie_id: 1,
    title: "The Matrix",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    banner:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    release_year: 1999,
    genre: "Sci-Fi",
    duration: 136,
    rating: "R",
    is_available: true,
    reviews: [
      {
        review_id: 1,
        user: { username: "moviefan1" },
        rating: 5,
        review_text: "One of the best sci-fi movies ever made!",
        review_date: "2023-01-15T12:30:00Z",
      },
      {
        review_id: 2,
        user: { username: "filmcritic" },
        rating: 4,
        review_text: "Revolutionary visual effects and a mind-bending story.",
        review_date: "2023-02-20T15:45:00Z",
      },
    ],
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            demoMovie.banner || "/placeholder.svg?height=1080&width=1920"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {demoMovie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {demoMovie.release_year && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{demoMovie.release_year}</span>
                </div>
              )}

              {demoMovie.duration && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{demoMovie.duration} min</span>
                </div>
              )}

              {demoMovie.genre && (
                <div className="flex items-center">
                  <Film size={16} className="mr-1" />
                  <span>{demoMovie.genre}</span>
                </div>
              )}

              {demoMovie.rating && (
                <div className="px-2 py-1 bg-gray-800 rounded text-xs">
                  {demoMovie.rating}
                </div>
              )}

              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-500" />
                <span>
                  {demoMovie.reviews && demoMovie.reviews.length > 0
                    ? (
                        demoMovie.reviews.reduce(
                          (acc: number, review: any) => acc + review.rating,
                          0
                        ) / demoMovie.reviews.length
                      ).toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </div>

            <Link
              to={`/watch/${demoMovie.movie_id}`}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition"
            >
              <Play size={20} className="mr-2" />
              Watch Now
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="md:col-span-1">
            <img
              src={demoMovie.poster || "/placeholder.svg?height=450&width=300"}
              alt={demoMovie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-gray-300 mb-8">{demoMovie.description}</p>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>

              {demoMovie.reviews && demoMovie.reviews.length > 0 ? (
                <div className="space-y-4">
                  {demoMovie.reviews.map((review: any) => (
                    <div
                      key={review.review_id}
                      className="bg-gray-800 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="font-semibold">
                            {review.user.username}
                          </div>
                          <div className="ml-2 text-gray-400 text-sm">
                            {new Date(review.review_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-600"
                              }
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
