import prisma from '@/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ 
      message: 'Login successful', 
      userId: user.id,
      username: user.username
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Error during login' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
