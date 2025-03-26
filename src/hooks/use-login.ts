import { signIn } from "next-auth/react"
import { loginSchema } from "@/lib/auth/schemas"

export function useLogin() {
    const login = async (data: { email: string; password: string }) => {
        const validatedFields = loginSchema.safeParse(data)
        
        if (!validatedFields.success) {
            throw new Error(JSON.stringify(validatedFields.error.errors))
        }

        const result = await signIn("credentials", {
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            redirect: false,
        })

        if (result?.error) {
            throw new Error("Email ou mot de passe incorrect")
        }

        return result
    }

    return { login }
} 