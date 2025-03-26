import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/auth/schemas"
import { AuthService } from "@/_services/auth.service"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedFields = registerSchema.safeParse(body)
        
        if (!validatedFields.success) {
            return NextResponse.json(
                { error: "Données invalides" },
                { status: 400 }
            )
        }

        const user = await AuthService.createUser(validatedFields.data)
        return NextResponse.json({ 
            success: true, 
            userId: user.id,
            user
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Une erreur est survenue" },
            { status: 500 }
        )
    }
} 