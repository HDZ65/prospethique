import { NextResponse } from "next/server"
import { db } from "@/lib/firebase/firebase-admin"
import bcrypt from "bcryptjs"

export const runtime = 'nodejs'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        const userRef = db.collection("users")
        const userSnapshot = await userRef.where("email", "==", email).limit(1).get()

        if (userSnapshot.empty) {
            return NextResponse.json(
                { error: "Email ou mot de passe incorrect" },
                { status: 401 }
            )
        }

        const userDoc = userSnapshot.docs[0]
        const userData = userDoc.data()
        const isValidPassword = await bcrypt.compare(password, userData.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Email ou mot de passe incorrect" },
                { status: 401 }
            )
        }

        return NextResponse.json({
            id: userDoc.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthDate: userData.birthDate,
            profileImage: userData.profileImage,
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Une erreur est survenue" },
            { status: 500 }
        )
    }
} 