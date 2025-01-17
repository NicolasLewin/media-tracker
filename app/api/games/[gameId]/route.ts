import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { gameId: string } }) {
  const url = "https://api.igdb.com/v4/games";
  
  const gameId = params.gameId || new URL(request.url).searchParams.get('gameId');
  console.log('GameId from params:', params.gameId);
  console.log('Full request URL:', request.url);
  
  if (!gameId) {
    return NextResponse.json({ message: 'Game ID parameter is required' }, { status: 400 });
  }

  const clientId = process.env.CLIENT_ID_GAMES;
  const authorization = process.env.AUTHORIZATION_GAMES;

  if (!clientId || !authorization) {
    return NextResponse.json({ error: 'Missing API configuration' }, { status: 500 });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': clientId,
        'Authorization': authorization,
        'Content-Type': 'text/plain'
      } as HeadersInit,
      body: `fields name,summary,cover.*,rating,genres.*,platforms.*; where id = ${gameId};`
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