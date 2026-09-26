import { auth } from "@/lib/auth/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

type AuthHandler = (request: Request, context: RouteContext) => Promise<Response>;

const handlers = auth.handler();
const blockedPaths = new Set(["sign-up/email", "sign-in/social"]);

function withClosedRegistration(handler: AuthHandler): AuthHandler {
  return async (request, context) => {
    const { path } = await context.params;
    if (blockedPaths.has(path.join("/"))) {
      return new Response(null, { status: 403 });
    }
    return handler(request, context);
  };
}

export const GET = withClosedRegistration(handlers.GET);
export const POST = withClosedRegistration(handlers.POST);
export const PUT = withClosedRegistration(handlers.PUT);
export const DELETE = withClosedRegistration(handlers.DELETE);
export const PATCH = withClosedRegistration(handlers.PATCH);
