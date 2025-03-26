import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        const { password } = await request.json()
        
        if (!password) {
            return NextResponse.json(
                { error: "Le mot de passe est requis" },
                { status: 400 }
            )
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        return NextResponse.json({ hashedPassword })
    } catch (error) {
        return NextResponse.json(
            { error: "Une erreur est survenue" },
            { status: 500 }
        )
    }
} 