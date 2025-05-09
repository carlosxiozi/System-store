import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token } = await request.json();

  const response = NextResponse.json({ success: true });

  // Guardar token en una cookie HttpOnly
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 días
  });

  return response;
}
