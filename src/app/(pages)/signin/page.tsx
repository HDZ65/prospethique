import { LoginButton } from "@/components/auth-buttons/linkedin";
import { auth } from "@/lib/auth/next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
    const session = await auth();

    if (session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8 bg-gradient-glass backdrop-blur-glass rounded-lg border border-white/10 shadow-glass">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Connexion à l&apos;application
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Utilisez votre compte LinkedIn pour vous connecter
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                    <LoginButton />

                    <p className="text-sm text-gray-400 mt-4">
                        En vous connectant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité
                    </p>
                </div>
            </div>
        </div>
    );
} 