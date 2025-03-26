import { signIn } from "next-auth/react"
import { registerSchema, type RegisterInput } from "@/lib/auth/schemas"

export function useRegister() {
    const register = async (data: RegisterInput) => {
        const validatedFields = registerSchema.safeParse(data)
        
        if (!validatedFields.success) {
            throw new Error(JSON.stringify(validatedFields.error.errors))
        }

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedFields.data),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Une erreur est survenue")
        }

        // Connexion automatique après l'inscription
        const result = await signIn("credentials", {
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            redirect: false,
        })

        if (result?.error) {
            throw new Error("Erreur lors de la connexion")
        }

        return result
    }

    return { register }
} 