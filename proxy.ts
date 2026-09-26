import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

const authenticate = auth.middleware({ loginUrl: "/sign-in" });
const publicPaths = new Set([
  "/welcome",
  "/sign-in",
  "/sign-up",
  "/reset-password",
]);

function isSignInRedirect(response: NextResponse): boolean {
  const location = response.headers.get("location");
  if (!location) return false;
  return new URL(location, "http://localhost").pathname === "/sign-in";
}

function copyAuthCookies(source: NextResponse, target: NextResponse): NextResponse {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  return target;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth") || publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  let authResponse: NextResponse;
  try {
    authResponse = await authenticate(request);
  } catch {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/welcome", request.url));
    }
    if (pathname.startsWith("/api/")) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname === "/" && isSignInRedirect(authResponse)) {
    return copyAuthCookies(
      authResponse,
      NextResponse.rewrite(new URL("/welcome", request.url)),
    );
  }

  if (pathname.startsWith("/api/") && isSignInRedirect(authResponse)) {
    return copyAuthCookies(
      authResponse,
      new NextResponse(null, { status: 401 }),
    );
  }

  return authResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
