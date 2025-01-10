import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 })
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    return NextResponse.json({ isLoggedIn: true, user: decoded }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 })
  }
}