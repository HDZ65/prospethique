"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Linkedin } from "lucide-react"
import { useState } from "react"

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        try {
            setIsLoading(true)
            await signIn("linkedin", {
                callbackUrl: "/dashboard",
                redirect: true,
            })
        } catch (error) {
            console.error("Erreur de connexion:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full"
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Connexion en cours...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    <span>Continuer avec LinkedIn</span>
                </div>
            )}
        </Button>
    )
}