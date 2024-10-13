import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { movieId: string } }) {
  const movieId = params.movieId;

  if (!movieId) {
    return NextResponse.json({ message: 'Movie ID is required' }, { status: 400 });
  }

  const apiKey = process.env.OMDB_API_KEY;
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=full`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json({ message: data.Error }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Error fetching movie details' }, { status: 500 });
  }
}