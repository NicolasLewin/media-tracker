"use client"

import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";
import { Game } from "@/types";
import { useState } from "react";

export default function Games() {

    const [game, setGame] = useState<Game | null>(null)

    async function fetchGames() {
      try {
        const response = await fetch("http://localhost:3000/api/games");
        const jsonData = (await response.json()) as Game;
        console.log(jsonData);
        setGame(jsonData);
      } catch (e) {
        console.error("Error while fetching:", e);
      }
    }

    return (
    <main>
        <Header />
        <Spacing height={100} />
        <div>
          <button onClick={fetchGames}>Search</button>
          { game && game.coverUrl && <img src={game.coverUrl} alt="alt"/> }
          <img src={game?.coverUrl ?? ''} />
        </div>
    </main>
  );
}