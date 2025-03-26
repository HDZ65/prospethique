import { auth } from "@/lib/auth/next-auth";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";

export default async function RegisterPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
            <div className="flex items-center justify-center">
                <AuthCard type="register" />
            </div>
        </div>
    );
} 