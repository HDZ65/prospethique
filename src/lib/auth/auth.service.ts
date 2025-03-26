import { db } from "@/lib/firebase/firebase-admin"
import bcrypt from "bcryptjs"
import { RegisterInput } from "./schemas"

export class AuthService {
    static async createUser(data: RegisterInput) {
        const { email, password, firstName, lastName, birthDate, profileImage } = data

        // Vérifier si l'utilisateur existe déjà
        const userRef = db.collection("users")
        const userSnapshot = await userRef.where("email", "==", email).limit(1).get()

        if (!userSnapshot.empty) {
            throw new Error("Un utilisateur avec cet email existe déjà")
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Créer l'utilisateur
        const docRef = await userRef.add({
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
        const userRef = db.collection("users")
        const userSnapshot = await userRef.where("email", "==", email).limit(1).get()

        if (userSnapshot.empty) {
            return null
        }

        const userDoc = userSnapshot.docs[0]
        const userData = userDoc.data()
        const isValidPassword = await bcrypt.compare(password, userData.password)

        if (!isValidPassword) {
            return null
        }

        return {
            id: userDoc.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthDate: userData.birthDate,
            profileImage: userData.profileImage,
        }
    }
} 