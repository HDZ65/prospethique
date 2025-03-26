import { db } from "@/lib/firebase/firebase-admin"
import { registerSchema } from "@/lib/auth/schemas"
import bcrypt from "bcryptjs"

export async function registerUser(data: unknown) {
    const validatedFields = registerSchema.safeParse(data)
    
    if (!validatedFields.success) {
        return { error: "Données invalides" }
    }

    const { 
        email, 
        password, 
        firstName, 
        lastName, 
        birthDate, 
        profileImage 
    } = validatedFields.data

    // Vérifier si l'utilisateur existe déjà
    const userRef = db.collection("users").where("email", "==", email).limit(1)
    const userSnapshot = await userRef.get()

    if (!userSnapshot.empty) {
        return { error: "Un utilisateur avec cet email existe déjà" }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const newUserRef = await db.collection("users").add({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthDate: birthDate || null,
        profileImage: profileImage || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    return { 
        success: true, 
        userId: newUserRef.id,
        user: {
            id: newUserRef.id,
            email,
            firstName,
            lastName,
            birthDate,
            profileImage,
        }
    }
} 