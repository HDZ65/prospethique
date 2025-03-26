import "next-auth"

declare module "next-auth" {
    interface User {
        id?: string
        email?: string | null
        firstName: string
        lastName: string
        birthDate?: string | null
        profileImage?: string | null
    }

    interface Session {
        user: User & {
            id: string
            firstName: string
            lastName: string
            birthDate?: string | null
            profileImage?: string | null
        }
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        firstName: string
        lastName: string
    }
} 