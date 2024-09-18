"use client"


import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameDetailsPage({ params }: {params: { gameId: string}}) {
    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("null");
    const router = useRouter();
    const id = params.gameId;
  
    useEffect(() => {
      if (id) {
        console.log("aa");
        fetchGameDetails(id);
      }
    }, [id]);
  
    const fetchGameDetails = async (gameId: string) => {
      try {
        //const response = await fetch(`/api/game/${gameId}`);
        const response = await fetch(`http://localhost:3000/api/games?query=${gameId}`);
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
    
    return (
        <main>
            <Header />
            <Spacing height={100} />
            <div>
              <p>{id}</p>
              {isLoading && <p>Loading...</p>}
              {error && <p className="text-red-500 mb-4">{error}</p>}
            </div>
        </main>
    );
  }
  