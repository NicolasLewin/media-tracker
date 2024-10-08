import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = "https://api.igdb.com/v4/games";
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': process.env.CLIEND_ID_GAMES,
        'Authorization': process.env.AUTHORIZATION_GAMES,
      },
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