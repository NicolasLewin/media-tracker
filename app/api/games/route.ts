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
      body: 'fields name,summary,cover.*; search "zelda"; limit 10;'
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();


    return NextResponse.json(data);
  } catch (error) {
      console.error('Error fetching game data:', error);
      return NextResponse.json({ error: 'Error fetching game data' }, { status: 500 });
  }
}