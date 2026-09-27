import { NextResponse, type NextRequest } from "next/server";
import type { NeonAuth } from "@neondatabase/auth/next/server";
import { getAuth } from "@/lib/auth/server";
import { hasAuthEnv } from "@/lib/env";
import { isAuthConfigurationError } from "@/lib/env-validation";

const publicPaths = new Set([
  "/styleguide",
  "/welcome",
  "/sign-in",
  "/sign-up",
  "/reset-password",
]);
let authenticate: ReturnType<NeonAuth["middleware"]> | undefined;

function getAuthenticate() {
  authenticate ??= getAuth().middleware({ loginUrl: "/sign-in" });
  return authenticate;
}

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

  if (pathname === "/" && !hasAuthEnv()) {
    return NextResponse.rewrite(new URL("/welcome", request.url));
  }

  let authResponse: NextResponse;
  try {
    authResponse = await getAuthenticate()(request);
  } catch (error) {
    if (isAuthConfigurationError(error)) console.error(error.message);
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
