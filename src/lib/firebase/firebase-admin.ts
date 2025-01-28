
import admin from "firebase-admin";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Vérification des variables d'environnement requises
const requiredEnvVars = [
    'FIREBASE_ADMIN_SDK_PROJECT_ID',
    'FIREBASE_ADMIN_SDK_PRIVATE_KEY',
    'FIREBASE_ADMIN_SDK_CLIENT_EMAIL'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Variable d'environnement manquante: ${envVar}`);
    }
}

// Configuration de base avec les variables essentielles
const config = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_SDK_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
        // Variables optionnelles
        ...(process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY_ID && {
            privateKeyId: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY_ID
        }),
        ...(process.env.FIREBASE_ADMIN_SDK_CLIENT_ID && {
            clientId: process.env.FIREBASE_ADMIN_SDK_CLIENT_ID
        }),
        ...(process.env.FIREBASE_ADMIN_SDK_AUTH_URI && {
            authUri: process.env.FIREBASE_ADMIN_SDK_AUTH_URI
        }),
        ...(process.env.FIREBASE_ADMIN_SDK_TOKEN_URI && {
            tokenUri: process.env.FIREBASE_ADMIN_SDK_TOKEN_URI
        }),
    } as admin.ServiceAccount),
};

let firebaseApp;
let db: Firestore;

try {
    // Initialisation de Firebase Admin
    firebaseApp = !admin.apps.length
        ? admin.initializeApp(config)
        : admin.app();

    // Initialisation de Firestore
    db = getFirestore(firebaseApp);
} catch (error) {
    console.error('Erreur d\'initialisation de Firebase Admin:', error);
    throw new Error('Impossible d\'initialiser Firebase Admin');
}

export { firebaseApp, db };