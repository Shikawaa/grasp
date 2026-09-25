import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes: /sign-in, /sign-up, /reset-password, /auth/*, /api/auth/*, /share/*
  const isPublicRoute =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/share/");

  // Look for Neon Auth / Better Auth session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("neon-auth.session_token") ||
    request.cookies.get("__Secure-neon-auth.session_token");

  let isAuthenticated = false;

  if (sessionCookie && process.env.NEON_AUTH_BASE_URL) {
    try {
      const res = await fetch(
        `${process.env.NEON_AUTH_BASE_URL.replace(/\/$/, "")}/get-session`,
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          isAuthenticated = true;
        }
      }
    } catch {
      // In case of transient network error, trust valid cookie presence
      isAuthenticated = true;
    }
  }

  // Redirect unauthenticated requests to /sign-in
  if (!isAuthenticated && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup pages
  if (isAuthenticated && (pathname === "/sign-in" || pathname === "/sign-up")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
