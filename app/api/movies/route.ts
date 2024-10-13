import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.OMDB_API_KEY;
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json({ message: data.Error }, { status: 404 });
    }

    return NextResponse.json(data.Search);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return NextResponse.json({ error: 'Error fetching movie data' }, { status: 500 });
  }
}