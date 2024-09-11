"use client"

import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";
import { useEffect, useState } from "react";

export default function Games() {

    const [game, setGame] = useState([])

    async function fetchGames() {
      try {
        const response = await fetch("http://localhost:3000/api/games");
        const jsonData = (await response.json()).data;
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
          {game.map(game =>
             <div className="flex">
                {game.name}
              </div>
          )}
        </div>
    </main>
  );
}