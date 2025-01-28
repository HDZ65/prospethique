import LinkedInButton from "@/components/auth-buttons/linkedin";
import { auth } from "@/lib/auth/next-auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import Link from "next/link";

export default async function SignInPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
            <div className="flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardHeader className="space-y-1 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Bienvenue sur ProspEthique
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Connectez-vous avec votre compte LinkedIn pour commencer
                        </p>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <LinkedInButton />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                        <p>
                            En vous connectant, vous acceptez nos{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                conditions d&apos;utilisation
                            </Link>{" "}
                            et notre{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                politique de confidentialité
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}