import { auth } from "@/libs/auth/next-auth";

export class AuthService {
    constructor(
        // 
    ) {
        // 
    }
    /**
    * Vérifie l'authentification et retourne l'utilisateur
    */
    async checkAuth() {
        const session = await auth();
        if (!session?.user) {
            throw new Error("Unauthorized: User must be authenticated");
        }
        return session.user;
    }
}