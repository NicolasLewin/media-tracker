import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = "https://api.igdb.com/v4/games";
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
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
      body: `fields name,summary,cover.*; search "${query}"; limit 12;`
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