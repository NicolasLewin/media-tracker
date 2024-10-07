"use client"

import { GameCard } from "@/components/GameCard";
import { Spacing } from "@/components/Spacing";
import { useEffect, useState } from "react";

export default function Games() {

    const [query, setQuery] = useState("");
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (query) {
          fetchGames(query);
        } else {
          setGames([]);
        }
      }, 300);
  
      return () => clearTimeout(delayDebounceFn);
    }, [query]);


    async function fetchGames(searchQuery: string) {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`http://localhost:3000/api/games?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        const jsonData = (await response.json());
        setGames(jsonData);
      } catch (err) {
        console.error("Error while fetching:", err);
        setError("An error occurred while fetching games. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    return (
    <main>
        <Spacing height={100} />
        <div>
          <div className="flex items-center justify-center">
            <input type="search" id="search" className="block p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search games" required />
          </div>
          <Spacing height={100} />


          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}


          {games.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-3 items-center">
              {games && games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
              </div>
          ) : (
            query && !isLoading && <p>No games found. Try a different search term.</p>
          )}
          </div>
    </main>
  );
}