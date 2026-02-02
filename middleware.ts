import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // Admin route protection
        if (path.startsWith("/admin")) {
            const isAdmin = ["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(token?.role as string)
            if (!isAdmin) {
                return NextResponse.redirect(new URL("/", req.url))
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/post-ad/:path*",
        "/boost/:path*",
        "/chat/:path*",
    ],
}
