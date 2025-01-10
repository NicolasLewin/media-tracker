"use client"

import { Movie } from "@/types";
import { ReviewModal } from '@/components/ReviewModal';
import { Spacing } from "@/components/Spacing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

interface DetailedMovie extends Movie {
  Plot?: string;
  Director?: string;
  Actors?: string;
  Genre?: string;
  imdbRating?: string;
}

export default function MovieDetailsPage({ params }: { params: { movieId: string } }) {
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const movieId = params.movieId;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState('');

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }

    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/user/review-movie?movieId=${movieId}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentReview(data.review);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };
    
    fetchReview();

  }, [movieId]);

  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(`/api/movies/${movieId}?movieId=${movieId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const jsonData = await response.json();
      setMovie(jsonData);
    } catch (err) {
      console.error('Error:', err);
      setError("An error occurred while fetching movie details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (review: string) => {
    if (!movie?.imdbID) return;
    try {
      const response = await fetch('/api/user/review-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: String(movie.imdbID),
          review,
        }),
        credentials: 'include',
      });
  
      if (response.ok) {
        setCurrentReview(review);
        toast.success('Review submitted successfully!');
        setIsReviewModalOpen(false);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const removeFromProfile = async () => {
    if (!movie?.imdbID) return;
    try {
      const response = await fetch('/api/user/remove-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: String(movie.imdbID),
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove movie from profile');
      }

      toast.success('Movie removed from your profile!');
    } catch (error) {
      console.error('Error removing movie from profile:', error);
      toast.error(`Failed to remove movie from your profile: ${error.message}`);
    }
  };


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <main>
      <Spacing height={100} />
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 px-4 sm:max-w-5xl sm:mx-auto">
          <div className="relative bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <img 
                    src={movie?.Poster !== "N/A" ? movie?.Poster : "/placeholder.png"} 
                    alt={movie?.Title} 
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-2/3">
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{movie?.Title}</h1>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xl font-semibold">Rating: <span className="font-normal">{movie?.imdbRating} / 10</span></p>
                    </div>
                    {movie?.Plot && (
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Plot</h2>
                        <p className="text-gray-700">{movie.Plot}</p>
                      </div>
                    )}
                    {movie?.Genre && (
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Genre</h2>
                        <div className="flex flex-wrap gap-2">
                          {movie.Genre.split(', ').map(genre => (
                            <span key={genre} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {movie?.Director && (
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Director</h2>
                        <p className="text-gray-700">{movie.Director}</p>
                      </div>
                    )}
                    {movie?.Actors && (
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Actors</h2>
                        <p className="text-gray-700">{movie.Actors}</p>
                      </div>
                    )}
                    <div className="flex">
                      <div>
                        <button 
                          onClick={() => router.back()} 
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Back to List
                        </button>
                      </div>
                      <div className="pl-8">
                        <button 
                          onClick={removeFromProfile} 
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Remove from profile
                        </button>
                      </div>
                      <div className="pl-8">
                        <button 
                          onClick={() => setIsReviewModalOpen(true)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          {currentReview ? 'Edit Review' : 'Write Review'}
                        </button>
                      </div>
                        <ReviewModal
                          isOpen={isReviewModalOpen}
                          onClose={() => setIsReviewModalOpen(false)}
                          onSubmit={handleReviewSubmit}
                          initialReview={currentReview}
                          title={movie.Title}
                        />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}