import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/dashboard", "/settings", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    const sessionToken = req.cookies.get("authjs.session-token")?.value;
    const hasAuth = !!sessionToken;

    if (!hasAuth) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/profile/:path*"],
};
