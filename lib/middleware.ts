import { NextRequest, NextResponse } from "next/server";

const COOKIE = process.env.SESSION_COOKIE_NAME || "_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  const hasSession = req.cookies.get(COOKIE)?.value;

  // Sin sesión → redirigir a login
  if (!hasSession) {
    const url = new URL("/Login", req.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
