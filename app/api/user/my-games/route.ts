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

    const userGames = await prisma.userGame.findMany({
      where: { user_id: decodedToken.userId },
      select: {
        game_api_id: true,
      }
    })

    return NextResponse.json({ userGames }, { status: 200 })

  } catch (error) {
    console.error('Error fetching user games:', error)
    return NextResponse.json({ message: 'Error fetching user games' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}