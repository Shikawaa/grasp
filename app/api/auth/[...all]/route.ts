import { NextRequest, NextResponse } from "next/server";

const AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL;

async function handler(req: NextRequest) {
  if (!AUTH_BASE_URL) {
    return NextResponse.json(
      { error: "NEON_AUTH_BASE_URL is not configured" },
      { status: 500 }
    );
  }

  // Extract path after /api/auth
  const pathname = req.nextUrl.pathname.replace(/^\/api\/auth/, "");
  const targetUrl = new URL(
    AUTH_BASE_URL.replace(/\/$/, "") + pathname + req.nextUrl.search
  );

  // Forward only necessary headers to avoid triggering upstream HTTP->HTTPS redirect loops
  const headers = new Headers();
  const allowedHeaders = [
    "user-agent",
    "authorization",
    "content-type",
    "accept",
    "referer",
  ];
  for (const h of allowedHeaders) {
    const val = req.headers.get(h);
    if (val) headers.set(h, val);
  }

  // Preserve Origin (essential for Neon Auth CORS and CSRF checks)
  const origin = req.headers.get("origin") || req.nextUrl.origin;
  if (origin) {
    headers.set("origin", origin);
  }

  // Forward incoming session cookies
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  // Mark as middleware-processed for Neon Auth
  headers.set("x-neon-auth-middleware", "true");

  try {
    const isBodyAllowed = !["GET", "HEAD"].includes(req.method);
    const bodyBuffer = isBodyAllowed ? await req.arrayBuffer() : undefined;

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: bodyBuffer,
      redirect: "manual",
    });

    const resHeaders = new Headers();

    // Forward standard response headers
    const forwardResponseHeaders = [
      "content-type",
      "content-encoding",
      "date",
      "location",
      "x-neon-ret-request-id",
    ];
    for (const h of forwardResponseHeaders) {
      const val = response.headers.get(h);
      if (val) resHeaders.set(h, val);
    }

    // Forward Set-Cookie headers properly
    const setCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];

    if (setCookies.length > 0) {
      for (const cookieStr of setCookies) {
        resHeaders.append("set-cookie", cookieStr);

        // In localhost development over HTTP, also set the cookie without __Secure- prefix
        // so browsers on plain http://localhost won't drop it
        if (cookieStr.includes("__Secure-")) {
          const plainCookie = cookieStr
            .replace("__Secure-", "")
            .replace("SameSite=None", "SameSite=Lax");
          resHeaders.append("set-cookie", plainCookie);
        }
      }
    } else {
      const fallbackCookie = response.headers.get("set-cookie");
      if (fallbackCookie) {
        resHeaders.set("set-cookie", fallbackCookie);
        if (fallbackCookie.includes("__Secure-")) {
          resHeaders.append(
            "set-cookie",
            fallbackCookie
              .replace("__Secure-", "")
              .replace("SameSite=None", "SameSite=Lax")
          );
        }
      }
    }

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (error: any) {
    console.error("Neon Auth proxy error:", error);
    return NextResponse.json(
      { error: error?.message || "Auth proxy failure" },
      { status: 502 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
