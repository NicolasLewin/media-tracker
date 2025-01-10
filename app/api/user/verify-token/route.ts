import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return NextResponse.json({ isLoggedIn: true, user: decoded }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 })
  }
}