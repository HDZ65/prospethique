import type { NextAuthConfig } from "next-auth";
import LinkedIn from "next-auth/providers/linkedin"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./schemas"

export const authConfig = {
    providers: [
        LinkedIn({
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid profile email'
                }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    firstName: profile.name?.split(' ')[0] || '',
                    lastName: profile.name?.split(' ').slice(1).join(' ') || '',
                    profileImage: profile.picture,
                }
            }
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials)
                
                if (!validatedFields.success) {
                    return null
                }

                const { email, password } = validatedFields.data

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    })

                    if (!response.ok) {
                        return null
                    }

                    return await response.json()
                } catch (error) {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "linkedin") {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/create-user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            user,
                            accessToken: account.access_token,
                            expiresAt: account.expires_at
                        }),
                    })

                    if (!response.ok) {
                        return false
                    }

                    return true
                } catch (error) {
                    console.error("Erreur lors de la création/mise à jour de l'utilisateur:", error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.birthDate = user.birthDate
                token.profileImage = user.profileImage
            }
            if (account?.provider === "linkedin") {
                token.linkedinAccessToken = account.access_token
                token.linkedinTokenExpires = account.expires_at
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.firstName = token.firstName as string
                session.user.lastName = token.lastName as string
                session.user.birthDate = token.birthDate as string | null
                session.user.profileImage = token.profileImage as string | null
                session.user.linkedinAccessToken = token.linkedinAccessToken as string
                session.user.linkedinTokenExpires = token.linkedinTokenExpires as number
            }
            return session
        }
    }
} satisfies NextAuthConfig