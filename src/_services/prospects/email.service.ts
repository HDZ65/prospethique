import { ResendData, SendEmail } from "@/lib/schemas/email-template-schema";
import { STATUTS } from "@/lib/schemas/prospect-schema";
import { AuthService } from "@services/auth/auth.service";
import { Timestamp } from "firebase-admin/firestore";

export class EmailService {
    constructor(
        private readonly db: FirebaseFirestore.Firestore,
        private readonly authService: AuthService,
    ) {
        if (!db) throw new Error("Database connection required");
    }

    async getLastEmailForProspect(prospectId: string) {
        const lastEmailSnapshot = await this.db
            .collection('emails')
            .where('prospectId', '==', prospectId)
            .orderBy('created_at', 'desc')
            .limit(1)
            .get();

        return lastEmailSnapshot.docs[0]?.data() || null;
    }

    /**
     * Envoie un email à un prospect
     */
    async sendEmail(emailData: SendEmail, dateRelanceOptimale: Date, resendData: ResendData) {

        const user = await this.authService.checkAuth();

        // Vérification des autorisations
        const prospectRef = this.db.collection('prospects').doc(emailData.prospectId);
        const prospectDoc = await prospectRef.get();

        if (!prospectDoc.exists) {
            throw new Error("Prospect not found");
        }

        const prospectData = prospectDoc.data();
        if (prospectData?.userId !== user.id) {
            throw new Error("Unauthorized: This prospect doesn't belong to you");
        }


        // Création de l'email avec l'ID Resend
        const emailRef = this.db.collection('emails').doc(resendData.id);
        console.log('emailRef', this.translateResendStatus(resendData.last_event));

        const data = {
            ...emailData,
            ...resendData,
            last_event: this.translateResendStatus(resendData.last_event),
            userId: user.id,
        }

        console.log('data', data);
        await emailRef.set(data);

        // Mise à jour du prospect
        const updateData = {
            statut: this.translateResendStatus(resendData.last_event),
            dateRelanceOptimale: Timestamp.fromDate(dateRelanceOptimale),
            lastEmailSentAt: Timestamp.now(),
            lastEmailId: resendData.id,
            updatedAt: Timestamp.now(),
            updatedBy: user.id
        };

        await prospectRef.update(updateData);

        // Retourner les données mises à jour
        return { 
            ...prospectData,
            ...updateData,
            id: emailData.prospectId
        };
    }

    /**
    * Récupère les templates d'emails
    */
    async getEmailTemplates() {
        const user = await this.authService.checkAuth();

        const snapshot = await this.db
            .collection('emailTemplates')
            .where('userId', '==', user.id)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Récupère les prospects à relancer
     */
    async getDateRelanceOptimale() {
        const user = await this.authService.checkAuth();
        const now = Timestamp.now();

        const snapshot = await this.db.collection('prospects')
            .where('userId', '==', user.id)
            .where('dateRelanceOptimale', '<=', now)
            .where('statut', '==', 'Email envoyé')
            .get();

        return snapshot.docs;
    }

    /**
     * Récupère le nombre de prospects à relancer
     */
    async getFollowUpCount() {
        const user = await this.authService.checkAuth();
        const now = Timestamp.now();

        try {
            const snapshot = await this.db.collection('prospects')
                .where('userId', '==', user.id)
                .where('dateRelanceOptimale', '<=', now)
                .where('statut', '==', 'Email envoyé')
                .count()
                .get();

            return {
                count: snapshot.data().count,
                lastUpdate: now
            };
        } catch (error) {
            console.error('Erreur lors du comptage des prospects à relancer:', error);
            throw new Error('Impossible de récupérer le nombre de prospects à relancer');
        }
    }

    async updateEmailStatus(emailId: string, resendData: ResendData) {
        const emailRef = this.db.collection('emails').doc(emailId);
        await emailRef.update({
            ...resendData,
            last_event: this.translateResendStatus(resendData.last_event)
        });
    }

    async getEmailStatus(emailId: string) {
        const emailDoc = await this.db.collection('emails').doc(emailId).get();
        return emailDoc.data()?.status || null;
    }

    // Fonction de traduction des statuts Resend
    private translateResendStatus(resendStatus: string): typeof STATUTS[number] {
        const statusMap: Record<string, typeof STATUTS[number]> = {
            'sent': 'E-mail envoyé',
            'delivered': 'E-mail délivré',
            'delivery_delayed': 'E-mail délivré avec retard',
            'complained': 'E-mail signalé comme spam',
            'bounced': 'E-mail rejeté',
        };

        return statusMap[resendStatus] || 'À contacter';
    }

    async getEmailHistory() {
        const user = await this.authService.checkAuth();
        
        const snapshot = await this.db
            .collection('emails')
            .where('userId', '==', user.id)
            .orderBy('created_at', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async deleteEmail(emailId: string) {
        const user = await this.authService.checkAuth();
        
        // Vérifier que l'email appartient à l'utilisateur
        const emailDoc = await this.db.collection('emails').doc(emailId).get();
        if (!emailDoc.exists) {
            throw new Error("Email not found");
        }
        
        const emailData = emailDoc.data();
        if (emailData?.userId !== user.id) {
            throw new Error("Unauthorized: This email doesn't belong to you");
        }

        await this.db.collection('emails').doc(emailId).delete();
        return { success: true };
    }

    async getEmailById(emailId: string) {
        const user = await this.authService.checkAuth();
        
        const emailDoc = await this.db.collection('emails').doc(emailId).get();
        if (!emailDoc.exists) {
            throw new Error("Email not found");
        }
        
        const emailData = emailDoc.data();
        if (emailData?.userId !== user.id) {
            throw new Error("Unauthorized: This email doesn't belong to you");
        }

        return {
            id: emailDoc.id,
            ...emailData
        };
    }

}





// async getEmailHistory() {
//     try {
//         const user = await this.authService.checkAuth();
//         console.log('User authenticated:', user.id);

//         const query = this.db
//             .collection('emails')
//             .where('userId', '==', user.id)
//             .orderBy('created_at', 'desc');
        
//         console.log('Query built:', query);

//         const snapshot = await query.get();
//         console.log('Snapshot empty?', snapshot.empty);
//         console.log('Snapshot size:', snapshot.size);
//         console.log('Snapshot docs:', snapshot.docs.length);

//         const emails = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
        
//         console.log('Mapped emails:', emails.length);
        
//         return emails;
//     } catch (error) {
//         console.error('Error in getEmailHistory:', error);
//         throw error;
//     }
// }