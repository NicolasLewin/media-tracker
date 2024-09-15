"use client"

import { GameCard } from "@/components/GameCard";
import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";
import { Game } from "@/types";
import { useEffect, useState } from "react";

export default function Games() {

    const [games, setGames] = useState<Game[] | null>(null)

    async function fetchGames() {
      try {
        const response = await fetch("http://localhost:3000/api/games");
        const jsonData = (await response.json()) as Game[];
        console.log(jsonData);
        setGames(jsonData);
      } catch (e) {
        console.error("Error while fetching:", e);
      }
    }


    useEffect(() => {
      fetchGames();
    }, []);

    return (
    <main>
        <Header />
        <Spacing height={100} />
        <div>
          <div className="flex items-center justify-center">
            <input type="search" id="search" className="block p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search" required />
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
          </div>
          <Spacing height={100} />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-rows-3 items-center">
            {games && games.map((game) => (
                <GameCard id={game.id} title={game.name} cover={game.cover.url} />
            ))}
            </div>
        </div>
    </main>
  );
}