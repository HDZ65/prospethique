import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/auth.config"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { db } from "@/lib/firebase/firebase-admin"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: FirestoreAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        updateAge: 24 * 60 * 60, // 24 heures
    },
    pages: {
        signIn: '/auth/sign-in',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, profile }) {
            if (!token.sub) return token
            
            if (profile?.picture) {
                token.picture = profile.picture
            }
            return token
        },
        async session({ session, token }) {
            if (token.picture) {
                session.user.image = token.picture
            }
            if (token.sub) {
                session.user.id = token.sub || ''
            }
            return session
        },
    },
    ...authConfig,
})