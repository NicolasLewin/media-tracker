import { Game } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = "https://api.igdb.com/v4/games";
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': '',
        'Authorization': 'Bearer ',
      },
      body: 'fields name,summary,cover.*; where id = 1942; limit 1;'
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const game = data[0];

    const coverUrl = (() => {
      if (game.cover?.image_id)
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      return null
    })()

    const gameData: Game = {
      id: game.id,
      name: game.name,
      summary: game.summary,
      coverUrl: coverUrl
    };

    return NextResponse.json(gameData);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json({ error: 'Error fetching game data' }, { status: 500 });
  }
}