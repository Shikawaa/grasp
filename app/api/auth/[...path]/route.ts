import type { NeonAuth } from "@neondatabase/auth/next/server";
import { getAuth } from "@/lib/auth/server";
import { isAuthConfigurationError } from "@/lib/env-validation";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

type AuthHandler = (request: Request, context: RouteContext) => Promise<Response>;

const blockedPaths = new Set(["sign-up/email", "sign-in/social"]);
let handlers: ReturnType<NeonAuth["handler"]> | undefined;

function getHandlers() {
  handlers ??= getAuth().handler();
  return handlers;
}

function withClosedRegistration(handler: AuthHandler): AuthHandler {
  return async (request, context) => {
    const { path } = await context.params;
    if (blockedPaths.has(path.join("/"))) {
      return new Response(null, { status: 403 });
    }
    return handler(request, context);
  };
}

type AuthMethod = keyof ReturnType<NeonAuth["handler"]>;

function createHandler(method: AuthMethod): AuthHandler {
  return async (request, context) => {
    try {
      return await withClosedRegistration(getHandlers()[method])(request, context);
    } catch (error) {
      if (!isAuthConfigurationError(error)) throw error;

      console.error(error.message);
      return Response.json(
        {
          code: "AUTH_UNAVAILABLE",
          message: "Authentication is temporarily unavailable.",
        },
        { status: 503 },
      );
    }
  };
}

export const GET = createHandler("GET");
export const POST = createHandler("POST");
export const PUT = createHandler("PUT");
export const DELETE = createHandler("DELETE");
export const PATCH = createHandler("PATCH");
