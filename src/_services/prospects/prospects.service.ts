import { Prospect } from "@/libs/schemas/prospect-schema";
import { AuthService } from "@services/auth/auth.service";

export class ProspectService {
    constructor(
        private readonly db: FirebaseFirestore.Firestore,
        private readonly authService: AuthService,
    ) {
        if (!db) throw new Error("Database connection required");
    }
    /**
    * Récupère tous les prospects de l'utilisateur connecté
    */
    async getAllProspects() {
        try {
            const user = await this.authService.checkAuth();
            const snapshot = await this.db
                .collection('prospects')
                .where('userId', '==', user.id)
                .orderBy('dateCreation', 'desc')
                .get();


            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convertir les timestamps Firestore en strings ISO
                    dateCreation: data.dateCreation?.toDate().toISOString(),
                    dateRelanceOptimale: data.dateRelanceOptimale?.toDate().toISOString()
                };
            });
        } catch (error) {
            console.error('Erreur dans getAllProspects:', error);
            throw error;
        }
    }
    /**
    * Crée un nouveau prospect pour l'utilisateur connecté
    */
    async createProspect(prospect: Prospect) {
        const user = await this.authService.checkAuth();
        const docRef = await this.db
            .collection('prospects')
            .add({
                ...prospect,
                userId: user.id, // Ajoute l'ID de l'utilisateur
                createdBy: user.id,
                dateCreation: new Date()
            });
        return docRef.id;
    }
    /**
    * Met à jour un prospect de l'utilisateur
    */
    async updateProspect(id: string, data: Partial<Prospect>) {
        const user = await this.authService.checkAuth();
        // Vérifie que le prospect appartient à l'utilisateur
        const prospectRef = this.db.collection('prospects').doc(id);
        const prospectDoc = await prospectRef.get();
        if (!prospectDoc.exists) {
            throw new Error("Prospect not found");
        }
        const prospectData = prospectDoc.data();
        if (prospectData?.userId !== user.id) {
            throw new Error("Unauthorized: This prospect doesn't belong to you");
        }
        // Met à jour le prospect
        await prospectRef.update({
            ...data,
            userId: user.id, // Conserve l'ID de l'utilisateur
            updatedBy: user.id,
            updatedAt: new Date()
        });
    }
    /**
    * Supprime un prospect de l'utilisateur
    */
    async deleteProspect(id: string) {
        const user = await this.authService.checkAuth();
        // Vérifie que le prospect appartient à l'utilisateur
        const prospectRef = this.db.collection('prospects').doc(id);
        const prospectDoc = await prospectRef.get();
        if (!prospectDoc.exists) {
            throw new Error("Prospect not found");
        }
        const prospectData = prospectDoc.data();
        if (prospectData?.userId !== user.id) {
            throw new Error("Unauthorized: This prospect doesn't belong to you");
        }
        // Supprime le prospect
        await prospectRef.delete();
    }
}
