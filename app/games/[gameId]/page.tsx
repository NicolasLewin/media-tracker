"use client"

import { Game } from "@/types";
import { Spacing } from "@/components/Spacing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
interface DetailedGame extends Game {
  summary?: string;
  rating?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
}

export default function GameDetailsPage({ params }: {params: { gameId: string}}) {
    const [game, setGame] = useState<DetailedGame[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const gameId = params.gameId;
  
    useEffect(() => {
      if (gameId) {
        fetchGameDetails(gameId);
      }
    }, [gameId]);
  
    const fetchGameDetails = async (gameId: string) => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }
        const jsonData = await response.json();
        setGame(jsonData);
      } catch (err) {
        console.error('Error:', err);
        setError("An error occurred while fetching game details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const addToProfile = async () => {
      if (!game[0]?.id) {
        return;
      }

      try {
        const response = await fetch('/api/user/add-game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId: String(game[0].id),
          }),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to add game to profile');
        }

        toast.success('Game added to your profile!');
      } catch (error) {
        console.error('Error adding game to profile:', error);
        if (error instanceof Error) {
          if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
            toast.error('Please log in to add games to your profile.');
          } else if (error.message === 'The game is already in your profile') {
            toast.success('This game is already in your profile.', {
              icon: '🔔',
              style: {
                background: '#3498db',
                color: '#fff',
              },
            });
          } else {
            toast.error(`Failed to add game to your profile: ${error.message}`);
          }
        }
      }
    };


    return (
        <main>
          <Spacing height={100} />
          {game.length > 0 ? (
          <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 px-4 sm:max-w-5xl sm:mx-auto">
              <div className="relative bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col md:flex-row md:space-x-8">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                      {game[0].cover && (
                        <img 
                          src={game[0].cover.url.replace('t_thumb', 't_cover_big')} 
                          alt={game[0].name} 
                          className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                      )}
                    </div>
                    <div className="md:w-2/3">
                      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{game[0].name}</h1>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xl font-semibold">Rating: <span className="font-normal">{game[0].rating ? game[0].rating.toFixed(1) : 'N/A'} / 100</span></p>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-2">Summary</h2>
                          <p className="text-gray-700">{game[0].summary}</p>
                        </div>
                        {game[0].genres && (
                          <div>
                            <h2 className="text-xl font-semibold mb-2">Genres</h2>
                            <div className="flex flex-wrap gap-2">
                              {game[0].genres.map(genre => (
                                <span key={genre.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {game[0].platforms && (
                          <div>
                            <h2 className="text-xl font-semibold mb-2">Platforms</h2>
                            <div className="flex flex-wrap gap-2">
                              {game[0].platforms.map(platform => (
                                <span key={platform.id} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                  {platform.name}
                                </span>
                              ))}
                            </div>
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
                              onClick={addToProfile} 
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                              Add to profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <p>No game found.</p>
          )}
        </main>
    );
  }
  