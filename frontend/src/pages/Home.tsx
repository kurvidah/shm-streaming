"use client";

import React from "react";
import HeroSlider from "../components/HeroSlider";
import MovieCard from "../components/MovieCard";

//  Currently using demo data for development/testing purposes.
//  To fetch real data from API, you can re-enable the useEffect block with axios.

const Home = () => {
  //  Demo data for featured movies (for HeroSlider)
  const demoFeaturedMovies = [
    {
      movie_id: 1,
      title: "The Matrix",
      description:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      banner:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      slug: "the-matrix",
    },
    {
      movie_id: 2,
      title: "Inception",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      banner:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      slug: "inception",
    },
  ];

  // Demo data for recently added movies
  const demoRecentMovies = [
    {
      movie_id: 1,
      title: "The Matrix",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      release_year: 1999,
      genre: "Sci-Fi",
      slug: "the-matrix",
    },
    {
      movie_id: 2,
      title: "Inception",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      release_year: 2010,
      genre: "Sci-Fi",
      slug: "inception",
    },
    {
      movie_id: 3,
      title: "The Godfather",
      poster:
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      release_year: 1972,
      genre: "Crime",
      slug: "the-godfather",
    },
    {
      movie_id: 4,
      title: "Pulp Fiction",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      release_year: 1994,
      genre: "Crime",
      slug: "pulp-fiction",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSlider movies={demoFeaturedMovies} />

      {/* Featured Movies Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {demoRecentMovies.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Recent Additions Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {demoRecentMovies.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
