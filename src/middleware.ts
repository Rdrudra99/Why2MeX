import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/']);
// const isProtectedRoute = createRouteMatcher(['/result', '/details']);
export default clerkMiddleware(
    async (auth, req) => {
        const { userId } = await auth();

        // if route is public and user is logged in , redirect them to /details
        
        if (isPublicRoute(req) && userId) {
            return NextResponse.redirect(new URL('/details', req.url))
        }
        //if route is protected and user is not authenticated , protect it
        if (!isPublicRoute(req) && !userId) {
            await auth.protect()
        }
    }
);




export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};