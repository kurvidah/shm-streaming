"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

interface Movie {
  movie_id: number
  title: string
  description: string
  banner: string
  slug: string
}

interface HeroSliderProps {
  movies: Movie[]
}

const HeroSlider = ({ movies }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [movies.length])

  if (!movies.length) return null

  const currentMovie = movies[currentIndex]

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${currentMovie.banner || "/placeholder.svg?height=1080&width=1920"})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentMovie.title}</h1>
          <p className="text-lg text-gray-300 mb-8 line-clamp-3">{currentMovie.description}</p>
          <div className="flex space-x-4">
            <Link
              to={`/movie/${currentMovie.slug}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition"
            >
              More Info
            </Link>
            <Link
              to={`/watch/${currentMovie.movie_id}`}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold transition"
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-red-600" : "bg-gray-500"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider

