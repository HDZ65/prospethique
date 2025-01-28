import { Prospect, UpdateProspect } from "@/lib/schemas/prospect-schema";
import { formatFirebaseDates } from "@/lib/utils/date";
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
                return formatFirebaseDates({
                    ...data,
                    id: doc.id,
                });
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
    async updateProspect(data: UpdateProspect) {
        const user = await this.authService.checkAuth();
        // Vérifie que le prospect appartient à l'utilisateur
        const prospectRef = this.db.collection('prospects').doc(data.id);
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
            updatedBy: user.id,
        });
    }
    /**
    * Supprime un prospect de l'utilisateur
    */
    async deleteProspect(id: string, deleteEmails: boolean) {
        const user = await this.authService.checkAuth();
        const prospectRef = this.db.collection('prospects').doc(id);
        const prospectDoc = await prospectRef.get();

        if (!prospectDoc.exists) {
            throw new Error("Prospect not found");
        }

        const prospectData = prospectDoc.data();
        if (prospectData?.userId !== user.id) {
            throw new Error("Unauthorized: This prospect doesn't belong to you");
        }

        if (deleteEmails) {
            const emailsSnapshot = await this.db
                .collection('emails')
                .where('prospectId', '==', id)
                .get();

            const batch = this.db.batch();
            emailsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

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

        return {
            ...data,
            id: prospectDoc.id,
        };
    }

}
