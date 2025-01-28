import { db } from "@/lib/firebase/firebase-admin";
import { auth } from "@/lib/auth/next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const batch = db.batch();
        const prospectsRef = db.collection('prospects');
        const prospects = await prospectsRef.get();

        prospects.docs.forEach((doc) => {
            batch.update(doc.ref, { userId: session.user?.id });
        });

        await batch.commit();
        return NextResponse.json({ message: "Mise à jour terminée" });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
} 
