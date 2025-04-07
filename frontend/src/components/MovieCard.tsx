import React from "react";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: {
    movie_id: number;
    title: string;
    poster: string;
    release_year: number;
    genre: string;
    slug: string;
  };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movie/${movie.slug}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
        <div className="relative aspect-[2/3]">
          <img
            src={movie.poster || `/placeholder.svg?height=450&width=300`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{movie.release_year}</span>
            <span>{movie.genre}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
