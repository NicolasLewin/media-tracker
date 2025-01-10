"use client"

import { Movie } from "@/types";
import { MovieCard } from "@/components/MovieCard";
import { Spacing } from "@/components/Spacing";
import { useEffect, useState } from "react";

export default function Movies() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetchMovies(query);
      } else {
        setMovies([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  async function fetchMovies(searchQuery: string) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/movies?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const jsonData = await response.json();
      setMovies(jsonData);
    } catch (err) {
      console.error("Error while fetching:", err);
      setError("An error occurred while fetching movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <Spacing height={100} />
      <div>
        <div className="flex items-center justify-center">
          <input 
            type="search" 
            id="search" 
            className="block p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search movies" 
            required 
          />
        </div>
        <Spacing height={100} />

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {movies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-3 items-center">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        ) : (
          query && !isLoading && <p>No movies found. Try a different search term.</p>
        )}
      </div>
    </main>
  );
}