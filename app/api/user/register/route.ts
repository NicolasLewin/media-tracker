
import prisma from '@/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse, NextRequest } from 'next/server'


export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}