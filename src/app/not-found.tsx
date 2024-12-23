import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[80vh] gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-xl text-muted-foreground">Cette page n'existe pas.</p>
            <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Retour à l'accueil
                </Link>
            </Button>
        </div>
    );
} 