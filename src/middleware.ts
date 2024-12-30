import { authConfig } from "@/libs/auth/auth.config";
import NextAuth from "next-auth";
import { 
    publicRoutes, 
    authRoutes, 
    apiAuthPrefix, 
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_LOGGED_IN_REDIRECT 
} from "@/libs/configs/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isRootPage = nextUrl.pathname === '/';

    // Ne rien faire pour les routes d'API auth
    if (isApiAuthRoute) {
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

    // Redirection vers la page de connexion si non connecté
    if (!isLoggedIn && !isPublicRoute && !isRootPage) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }
        
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(
            new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
};