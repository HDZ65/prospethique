import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/auth.config"

export const runtime = 'nodejs'

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        updateAge: 24 * 60 * 60, // 24 heures
    },
    pages: {
        signIn: '/auth/sign-in',
        error: '/auth/error',
    },
    ...authConfig,
})