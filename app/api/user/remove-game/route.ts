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

    const { gameId } = await request.json()
    
    const game_api_id = String(gameId)

    const deletedGame = await prisma.userGame.deleteMany({
      where: {
        user_id: decodedToken.userId,
        game_api_id: game_api_id,
      },
    })

    if (deletedGame.count === 0) {
      return NextResponse.json({ message: 'Game not found in user profile' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Game removed from profile' }, { status: 200 })

  } catch (error) {
    console.error('Error removing game from profile:', error)
    return NextResponse.json({ message: 'Error removing game from profile' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}