import { db } from "@/lib/firebase/firebase-admin"
import { RegisterInput } from "@/lib/auth/schemas"
import bcrypt from "bcryptjs"

export class AuthService {
    static async createUser(data: RegisterInput) {
        const { email, password, firstName, lastName, birthDate, profileImage } = data

        // Vérifier si l'utilisateur existe déjà
        const userRef = db.collection("users").where("email", "==", email).limit(1)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.empty) {
            throw new Error("Un utilisateur avec cet email existe déjà")
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Créer l'utilisateur
        const docRef = await db.collection("users").add({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            birthDate: birthDate || null,
            profileImage: profileImage || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        return {
            id: docRef.id,
            email,
            firstName,
            lastName,
            birthDate,
            profileImage,
        }
    }

    static async verifyCredentials(email: string, password: string) {
        const userRef = db.collection("users").where("email", "==", email).limit(1)
        const userSnapshot = await userRef.get()

        if (userSnapshot.empty) {
            return null
        }

        const user = userSnapshot.docs[0].data()
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return null
        }

        return {
            id: userSnapshot.docs[0].id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            profileImage: user.profileImage,
        }
    }
} 