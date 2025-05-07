import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // Get token from cookies
  const path = req.nextUrl.pathname;
  const isPublicPath = path.startsWith("/api/public/");

  if (isPublicPath) {
    // Allow the request to continue without authentication
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

  if (!token && !isPublicRoute) {
    // Redirect to login if token is missing
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isPublicRoute) {
    // Redirect to login if token is missing
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // Continue to the requested page
}

// Apply middleware to all routes
export const config = {
  matcher: "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
};
