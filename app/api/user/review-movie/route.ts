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

    const { movieId, review } = await request.json()
    
    const movie_api_id = String(movieId)

    const updatedUserMovie = await prisma.userMovie.updateMany({
      where: {
        user_id: decodedToken.userId,
        movie_api_id: movie_api_id,
      },
      data: {
        review: review,
      },
    })

    if (updatedUserMovie.count === 0) {
      return NextResponse.json({ message: 'Movie not found in user profile' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Review updated successfully' }, { status: 200 })

  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ message: 'Error updating review' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const userMovie = await prisma.userMovie.findFirst({
      where: {
        user_id: decodedToken.userId,
        movie_api_id: movieId,
      },
      select: {
        review: true,
      }
    })

    return NextResponse.json({ review: userMovie?.review || '' }, { status: 200 })

  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json({ message: 'Error fetching review' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}