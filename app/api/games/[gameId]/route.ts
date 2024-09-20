import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = "https://api.igdb.com/v4/games";
  
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json({ message: 'GameId parameter is required' }, { status: 400 });
  }
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': '',
        'Authorization': 'Bearer ',
      },
      body: `fields name,summary,cover.*; where"${gameId}";`
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();


    return NextResponse.json(data);
  } catch (error) {
      console.error('Error while fetching game details:', error);
      return NextResponse.json({ error: 'Error fetching game details' }, { status: 500 });
  }
}