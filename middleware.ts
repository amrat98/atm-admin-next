import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    "/dashboard",
    "/users",
    "/pool-users",
    "/transactions",
    "/investments",
    "/burning",
    "/login",
    "/otp",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token");

  // Define which routes are public (login/otp)
  const publicPaths = ["/login", "/otp"];

  // If user is not authenticated and tries to access protected routes
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from public pages (login, otp)
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Otherwise allow all requests
  return NextResponse.next();
}
