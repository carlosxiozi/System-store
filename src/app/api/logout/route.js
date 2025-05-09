// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler( res) {
  res.setHeader('Set-Cookie', serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0) // expirarla
  }));

  res.status(200).json({ message: 'Cierre de sesión exitoso' });
}
