import { withAuth } from "next-auth/middleware";

export default withAuth (
  // `withAuth` augments the Next.js `Request` with `token` and `user`
  function middleware(req) {
    console.log("CHECK 0001");
    console.log(req.nextauth);
    req.user = {name: "CHECK USER"};
    // You can access the user's session data here if needed
    // const token = req.nextauth.token;
    // const user = req.nextauth.user;

    // Example: Redirect to a specific page if the user is not an admin
    // if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.user?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if the user is authorized, false otherwise
        // For example, if a token exists, the user is considered authorized
        return !!token;
      },
    },
    pages: {
      signIn: '/',
    }
  },
)

export const config = {
  matcher: [
    '/', '/tournaments/:path*', '/tournaments/:id', '/players', '/teams', '/api/auth/:path*'
  ]
}