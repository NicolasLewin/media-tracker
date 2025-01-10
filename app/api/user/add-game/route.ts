import prisma from '@/prisma'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'

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

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const userGame = await prisma.userGame.create({
      data: {
        user: { connect: { id: user.id } },
        game_api_id: game_api_id,
      },
    })

    return NextResponse.json({ message: 'Game added to profile', userGame }, { status: 201 })

  } catch (error) {
    console.error('Error adding game to profile:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'The game is already in your profile' }, { status: 409 })
      }
    }
    return NextResponse.json({ message: 'Error adding game to profile' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}