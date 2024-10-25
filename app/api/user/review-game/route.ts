import prisma from '@/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { gameId, review } = await request.json()
    
    const game_api_id = String(gameId)

    const updatedUserGame = await prisma.userGame.updateMany({
      where: {
        user_id: decodedToken.userId,
        game_api_id: game_api_id,
      },
      data: {
        review: review,
      },
    })

    if (updatedUserGame.count === 0) {
      return NextResponse.json({ message: 'Game not found in user profile' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Review updated successfully' }, { status: 200 })

  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ message: 'Error updating review' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: Request) {
  try {
    const token = request.cookies.get('token')?.value
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const userGame = await prisma.userGame.findFirst({
      where: {
        user_id: decodedToken.userId,
        game_api_id: gameId,
      },
      select: {
        review: true,
      }
    })

    return NextResponse.json({ review: userGame?.review || '' }, { status: 200 })

  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json({ message: 'Error fetching review' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}