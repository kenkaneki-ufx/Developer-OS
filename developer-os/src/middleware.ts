import { auth } from "@/auth";

export default auth((req) => {
  // Protected routes that require authentication
  const protectedPaths = ["/dashboard", "/settings", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !req.auth) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.nextUrl.origin)
    );
  }

  return;
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/profile/:path*"],
};
