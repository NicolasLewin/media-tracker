"use client"

import { useEffect, useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { Spacing } from '@/components/Spacing';
import toast from 'react-hot-toast';
import { Game } from '@/types';

export default function MyGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserGames();
  }, []);

  const fetchUserGames = async () => {
    try {
      const response = await fetch('/api/user/my-games', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch user games');
      }
      const data = await response.json();
      const gameDetails = await Promise.all(data.userGames.map(fetchGameDetails));
      setGames(gameDetails.filter(game => game !== null));
    } catch (error) {
      console.error('Error fetching user games:', error);
      toast.error('Failed to load your games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameDetails = async (userGame: { game_api_id: string }): Promise<Game | null> => {
    try {
      const response = await fetch(`/api/games/${userGame.game_api_id}?gameId=${userGame.game_api_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch game details');
      }
      const gameData = await response.json();
      return gameData[0];
    } catch (error) {
      console.error('Error fetching game details:', error);
      return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Spacing height={100} />
      <h1 className="text-3xl font-bold mb-6">My Games</h1>
      {games.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-3 items-center">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <p>No games added to your profile yet.</p>
      )}
    </main>
  );
}