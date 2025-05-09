import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const isAuth = !!token;
  const isLoginPage = request.nextUrl.pathname === "/";

  // Si no está autenticado y no está en login, redirige al login
  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si está autenticado y está en login, redirige al dashboard
  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/components/Dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "components/Dashboard/:path*",
    "components/Categoria/:path*",
    "components/Producto/:path*",
    "components/Usuarios/:path*",
    "components/Deudores/:path*",
    "components/Reportes/:path*",
  ],
};
