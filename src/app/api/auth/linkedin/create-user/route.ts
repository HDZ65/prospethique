import { NextResponse } from "next/server"
import { db } from "@/lib/firebase/firebase-admin"

export const runtime = 'nodejs'

export async function POST(request: Request) {
    try {
        const { user, accessToken, expiresAt } = await request.json()

        // Vérifier si l'utilisateur existe déjà
        const userRef = db.collection("users")
        const userSnapshot = await userRef.where("email", "==", user.email).limit(1).get()

        if (userSnapshot.empty) {
            // Créer l'utilisateur s'il n'existe pas
            await userRef.add({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage,
                createdAt: new Date(),
                updatedAt: new Date(),
                provider: "linkedin",
                linkedinAccessToken: accessToken,
                linkedinTokenExpires: expiresAt
            })
        } else {
            // Mettre à jour le token LinkedIn si l'utilisateur existe
            const userDoc = userSnapshot.docs[0]
            await userDoc.ref.update({
                linkedinAccessToken: accessToken,
                linkedinTokenExpires: expiresAt,
                updatedAt: new Date()
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Erreur lors de la création/mise à jour de l'utilisateur:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Une erreur est survenue" },
            { status: 500 }
        )
    }
} 