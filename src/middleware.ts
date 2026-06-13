import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth.server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect client-side pages
  if (pathname === "/booking" || pathname === "/profile") {
    const sessionCookie = request.cookies.get("hermosa_session");

    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("login", "true");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyJWT(sessionCookie.value);
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("login", "true");
      url.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete("hermosa_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booking", "/profile"],
};
