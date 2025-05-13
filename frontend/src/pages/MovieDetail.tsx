import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { Play, Star, Clock, Calendar, Film, CirclePlay, Trash2 } from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = `/api/v1`;

const MovieDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";
  const [ review, setReview ] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/movies/${slug}/`);
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
  
  useEffect(() => {
    const fetchReview = async () => {
      if (!movie?.movie_id) return;
  
      try {
        setLoading(true);
        const responseReview = await axios.get(
          `${API_URL}/reviews?movie_id=${movie.movie_id}`
        );
        console.log(responseReview);
        setReview(responseReview.data.rows || []);
        console.log(responseReview);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReview([]);
        setError("Failed to load movie reviews");
        setLoading(false);
      }
    };
  
    fetchReview();
  }, [movie?.movie_id]);
  
  

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

  const handleDeleteReview = async ( selectedReviewID: number) => {
    if (window.confirm(`This action is irreversible. Are you sure you want to delete a review ID: ${selectedReviewID}?`)){
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`${API_URL}/admin/reviews/${selectedReviewID}`);
        setReview(review.filter((r) => r.review_id !== selectedReviewID));
        setLoading(false);

      } catch (err: any) {
        console.error(`Error deleting a plan witth ID ${selectedReviewID}:`, err.message);
        setError(`Failed to delete plan with ID ${selectedReviewID}`);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            movie.poster || "/placeholder.svg?height=1080&width=1920"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {movie.release_year && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{movie.release_year}</span>
                </div>
              )}

              {movie.duration && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{movie.duration} min</span>
                </div>
              )}

              {movie.genre && (
                <div className="flex items-center">
                  <Film size={16} className="mr-1" />
                  <span>{movie.genre}</span>
                </div>
              )}

              {movie.rating && (
                <div className="px-2 py-1 bg-gray-800 rounded text-xs">
                  {movie.rating}
                </div>
              )}

              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-500" />
                <span>
                  { review
                    ? (
                        review.reduce(
                          (acc: number, review: any) => acc + review.rating,
                          0
                        ) / review.length
                      ).toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </div>

            <Link
              to={`/watch/${movie.media[0].media_id}`}
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
              src={movie.poster || "/placeholder.svg?height=450&width=300"}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-gray-300 mb-8">{movie.description}</p>

            <div className="flex flex-row gap-8">
              {/* Left Column - Reviews */}
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                { review && review.length > 0 ? (
                  <div className="space-y-4">
                    {review.map((r: any) => (
                      <div
                        key={r.review_id}
                        className="bg-gray-800 rounded-lg p-4"
                      >
                        {isAdmin ? (<button className="p-1 text-gray-400 hover:text-red-500" onClick={() => handleDeleteReview(r.review_id)}> 
                                      <Trash2 size={18} /> 
                                    </button>
                                  ) : (null)
                        }

                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="font-semibold">
                              {r.username}
                            </div>
                            <div className="ml-2 text-gray-400 text-sm">
                              {new Date(r.review_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < r.rating
                                    ? "text-yellow-500"
                                    : "text-gray-600"
                                }
                                fill={i < r.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300">{r.review_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No reviews yet.</p>
                )}
              </div>

              {/* Right Column - Seasons and Episodes */}
              <div>
                <h2 className="text-xl font-bold mb-4">Seasons & Episodes</h2>
                <div className="lg:w-1/2 bg-gray-800 rounded-lg p-4 h-fit">
                  
                  {movie.media && movie.media.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Season</label>
                        <select
                          value={selectedSeason}
                          onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                          className="w-full bg-[#334155] text-white px-3 py-2 rounded-md"
                        >
                          {[...new Set(movie.media.map((m: any) => m.season))].map((season: number) => (<option key={season} value={season}>Season {season}</option>))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        {movie.media
                          .filter((m: any) => m.season === selectedSeason)
                          .sort((a: any, b: any) => a.episode - b.episode)
                          .map((m: any) => (
                            <div key={m.media_id} className="bg-[#1E293B] p-3 rounded-md flex flex-row gap-8">
                              <div>
                                <div className="font-semibold">Episode {m.episode}</div>
                                <div className="text-sm text-gray-400">{m.description}</div>
                              </div>
                              <div>
                                <button className=" text-blue-600 hover:text-shadow-blue-50 cursor-pointer" onClick={() => navigate(`/watch/${m.media_id}`)}>
                                <CirclePlay size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">No media available.</p>
                  )}
                </div>

              </div>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
