// pages/api/set-token.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token requerido' });
  }

  // Establecer cookie segura
  res.setHeader('Set-Cookie', serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  }));

  res.status(200).json({ message: 'Token guardado' });
}
