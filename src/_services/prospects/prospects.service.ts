import { Prospect, ProspectWithId, UpdateProspect } from "@/libs/schemas/prospect-schema";
import { AuthService } from "@services/auth/auth.service";
import { Timestamp } from "firebase-admin/firestore";

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
                    ...data,
                    id: doc.id,
                    dateCreation: data.dateCreation.toDate().toISOString(),
                    dateRelanceOptimale: data.dateRelanceOptimale.toDate().toISOString(),
                    updatedAt: data.updatedAt?.toDate().toISOString()
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
                userId: user.id,
                createdBy: user.id,
            });
        return docRef.id;
    }
    /**
    * Met à jour un prospect de l'utilisateur
    */
    async updateProspect(id: string, data: Partial<UpdateProspect>) {
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

        // Convertit la date de relance en Timestamp si elle existe
        const updateData = {
            ...data,
            dateRelanceOptimale: data.dateRelanceOptimale
                ? Timestamp.fromDate(new Date(data.dateRelanceOptimale))
                : prospectData?.dateRelanceOptimale,
            updatedBy: user.id,
            updatedAt: Timestamp.now()
        };

        // Met à jour le prospect
        await prospectRef.update(updateData);
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
    /**
    * Récupère un prospect par son ID
    */
    async getProspectById(id: string) {
        const user = await this.authService.checkAuth();
        const prospectDoc = await this.db.collection('prospects').doc(id).get();

        if (!prospectDoc.exists) {
            throw new Error("Prospect not found");
        }

        const data = prospectDoc.data();
        if (data?.userId !== user.id) {
            throw new Error("Unauthorized");
        }

        // Conversion des timestamps en chaînes ISO
        return {
            ...data,
            id: prospectDoc.id,
            dateCreation: data?.dateCreation?.toDate().toISOString(),
            dateRelanceOptimale: data?.dateRelanceOptimale?.toDate().toISOString(),
            updatedAt: data?.updatedAt?.toDate().toISOString()
        };
    }
}
