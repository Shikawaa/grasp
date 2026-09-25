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

  // Forward request headers
  const headers = new Headers(req.headers);
  headers.set("host", targetUrl.host);
  headers.set("x-forwarded-host", req.headers.get("host") || "localhost:3000");
  headers.set("x-forwarded-proto", req.nextUrl.protocol.replace(":", ""));

  try {
    const isBodyAllowed = !["GET", "HEAD"].includes(req.method);
    const bodyBuffer = isBodyAllowed ? await req.arrayBuffer() : undefined;

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: bodyBuffer,
      redirect: "manual",
    });

    const resHeaders = new Headers(response.headers);

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
