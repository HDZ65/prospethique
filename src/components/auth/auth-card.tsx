"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginSchema, registerSchema } from "@/lib/auth/schemas"
import { PasswordInput } from "./password-input"
import { FormMessage } from "@/components/ui/form"
import { useRegister } from "../../hooks/use-register"
import { useLogin } from "../../hooks/use-login"
import { Linkedin } from "lucide-react"

interface AuthCardProps {
    type: "login" | "register"
}

export function AuthCard({ type }: AuthCardProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    const { register } = useRegister()
    const { login } = useLogin()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setValidationErrors({})
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = type === "register" 
            ? {
                type: "register" as const,
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                confirmPassword: formData.get("confirmPassword") as string,
            }
            : {
                type: "login" as const,
                email: formData.get("email") as string,
                password: formData.get("password") as string,
            }

        try {
            if (data.type === "register") {
                await register(data)
            } else {
                await login(data)
            }
            router.push("/dashboard")
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("ZodError")) {
                    const zodErrors = JSON.parse(error.message)
                    const formattedErrors: Record<string, string> = {}
                    zodErrors.forEach((err: any) => {
                        formattedErrors[err.path[0]] = err.message
                    })
                    setValidationErrors(formattedErrors)
                } else {
                    setError(error.message)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>
                    {type === "login" ? "Connexion" : "Inscription"}
                </CardTitle>
                <CardDescription>
                    {type === "login" 
                        ? "Connectez-vous à votre compte" 
                        : "Créez votre compte pour commencer"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => signIn("linkedin", { 
                        callbackUrl: `${window.location.origin}/dashboard`
                    })}
                    className="w-full mb-4"
                >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                </Button>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Ou continuez avec
                        </span>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        {type === "register" && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        required
                                        disabled={isLoading}
                                    />
                                    {validationErrors.firstName && (
                                        <FormMessage>{validationErrors.firstName}</FormMessage>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        required
                                        disabled={isLoading}
                                    />
                                    {validationErrors.lastName && (
                                        <FormMessage>{validationErrors.lastName}</FormMessage>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                disabled={isLoading}
                            />
                            {validationErrors.email && (
                                <FormMessage>{validationErrors.email}</FormMessage>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            label="Mot de passe"
                            required
                            showValidation={type === "register"}
                            disabled={isLoading}
                        />
                        {validationErrors.password && (
                            <FormMessage>{validationErrors.password}</FormMessage>
                        )}
                        {type === "register" && (
                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirmer le mot de passe"
                                required
                                showValidation={false}
                                disabled={isLoading}
                            />
                        )}
                        {error && (
                            <div className="text-sm text-red-500">
                                {error}
                            </div>
                        )}
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Chargement..." : type === "login" ? "Se connecter" : "S'inscrire"}
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">
                    {type === "login" ? (
                        <>
                            Pas encore de compte ?{" "}
                            <Link
                                href="/auth/register"
                                className="text-primary hover:underline"
                            >
                                S'inscrire
                            </Link>
                        </>
                    ) : (
                        <>
                            Déjà un compte ?{" "}
                            <Link
                                href="/auth/sign-in"
                                className="text-primary hover:underline"
                            >
                                Se connecter
                            </Link>
                        </>
                    )}
                </p>
            </CardFooter>
        </Card>
    )
} 