import prisma from '@/prisma'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { movieId } = await request.json()
    
    const movie_api_id = String(movieId)

    const deletedMovie = await prisma.userMovie.deleteMany({
      where: {
        user_id: decodedToken.userId,
        movie_api_id: movie_api_id,
      },
    })

    if (deletedMovie.count === 0) {
      return NextResponse.json({ message: 'Movie not found in user profile' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Movie removed from profile' }, { status: 200 })

  } catch (error) {
    console.error('Error removing movie from profile:', error)
    return NextResponse.json({ message: 'Error removing movie from profile' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}