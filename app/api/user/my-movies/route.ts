import prisma from '@/prisma'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
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

    const userMovies = await prisma.userMovie.findMany({
      where: { user_id: decodedToken.userId },
      select: {
        movie_api_id: true,
      }
    })

    return NextResponse.json({ userMovies }, { status: 200 })

  } catch (error) {
    console.error('Error fetching user movies:', error)
    return NextResponse.json({ message: 'Error fetching user movies' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}