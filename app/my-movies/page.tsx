"use client"

import { useEffect, useState } from 'react';
import { MovieCard } from '@/components/MovieCard';
import { Spacing } from '@/components/Spacing';
import toast from 'react-hot-toast';
import { Movie } from '@/types';

export default function MyMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserMovies();
  }, []);

  const fetchUserMovies = async () => {
    try {
      const response = await fetch('/api/user/my-movies', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch user movies');
      }
      const data = await response.json();
      const movieDetails = await Promise.all(data.userMovies.map(fetchMovieDetails));
      setMovies(movieDetails.filter(movie => movie !== null));
    } catch (error) {
      console.error('Error fetching user movies:', error);
      toast.error('Failed to load your movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDetails = async (userMovie: { movie_api_id: string }): Promise<Movie | null> => {
    try {
      const response = await fetch(`/api/movies/${userMovie.movie_api_id}?movieId=${userMovie.movie_api_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const movieData = await response.json();
      return movieData;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Spacing height={100} />
      <h1 className="text-3xl font-bold mb-6">My Movies</h1>
      {movies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-3 items-center">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} mymovies={true} />
          ))}
        </div>
      ) : (
        <p>No movies added to your profile yet.</p>
      )}
    </main>
  );
}