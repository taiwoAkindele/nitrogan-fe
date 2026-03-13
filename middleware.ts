import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Tenant resolution for /org/[tenantId] routes
  const tenantMatch = pathname.match(/^\/org\/([^/]+)/);

  if (tenantMatch) {
    const tenantId = tenantMatch[1];
    const headers = new Headers(req.headers);
    headers.set("x-tenant-id", tenantId);

    return NextResponse.next({ headers });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
