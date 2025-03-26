import { authConfig } from "@/lib/auth/auth.config";
import NextAuth from "next-auth";
import { 
    publicRoutes, 
    authRoutes, 
    apiAuthPrefix,
    apiRoutes,
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_LOGGED_IN_REDIRECT 
} from "@/lib/configs/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isApiRoute = apiRoutes.some(route => {
        const pattern = route.replace(/:id/, '[^/]+');
        return new RegExp(`^${pattern}$`).test(nextUrl.pathname);
    });
    const isRootPage = nextUrl.pathname === '/';

    // Ne rien faire pour les routes d'API
    if (isApiAuthRoute || isApiRoute) {
        return NextResponse.next();
    }

    // Rediriger l'utilisateur connecté depuis la page d'accueil
    if (isLoggedIn && isRootPage) {
        return NextResponse.redirect(new URL(DEFAULT_LOGGED_IN_REDIRECT, nextUrl));
    }

    // Gestion des routes d'authentification
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return NextResponse.next();
    }

    // Protéger les routes non publiques
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/sign-in', nextUrl));
    }

    return NextResponse.next();
});

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
};