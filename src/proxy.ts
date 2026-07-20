import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the middleware file to `proxy.ts`. This single file
// composes two concerns:
//   1. Admin basic-auth for any /admin route (before locale handling).
//   2. next-intl locale routing for everything else.
const intlMiddleware = createMiddleware(routing);

// Constant-time string compare (edge runtime has no node:crypto).
function ctEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="pustakmaitri-admin", charset="UTF-8"' },
  });
}

// Returns a 401 response when admin credentials are missing/invalid, else null.
function requireAdminAuth(req: NextRequest): NextResponse | null {
  const header = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return unauthorized();

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized();
  }
  const idx = decoded.indexOf(":");
  const user = idx >= 0 ? decoded.slice(0, idx) : "";
  const pass = idx >= 0 ? decoded.slice(idx + 1) : "";

  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASS ?? "";
  // Compute both before combining so timing doesn't leak which field failed.
  const okUser = ctEqual(user, expectedUser);
  const okPass = ctEqual(pass, expectedPass);
  if (!expectedUser || !expectedPass || !(okUser && okPass)) return unauthorized();
  return null;
}

// Matches /admin, /{locale}/admin and /api/admin (and their subpaths).
const ADMIN_RE = /^\/(?:mr\/|en\/)?admin(?:\/|$)/;

export default function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const isApiAdmin = pathname.startsWith("/api/admin");
  if (ADMIN_RE.test(pathname) || isApiAdmin) {
    const denied = requireAdminAuth(req);
    if (denied) return denied;
    // API admin routes must not be run through locale routing.
    if (isApiAdmin) return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  // Run on all non-API paths (for locale routing) PLUS /api/admin (for auth).
  // Other /api/* routes (checkout, webhook, …) are intentionally excluded so
  // they stay public and un-localized.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/api/admin/:path*"],
};
