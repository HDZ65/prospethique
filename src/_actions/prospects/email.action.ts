'use server';
import { actionClient } from "@/lib/safe-action";
import { deleteEmailSchema, EmailStatus, ResendData, sendEmailSchema } from '@/lib/schemas/email-template-schema';
import { axiosInstance } from '@/lib/configs/axios.config';
import { revalidatePath } from 'next/cache';
import { formatFirebaseDates } from '@/lib/utils/date';
import { db } from '@/lib/firebase/firebase-admin';
import { EmailService } from '@services/prospects/email.service';
import { AuthService } from '@services/auth/auth.service';


const authService = new AuthService();
const emailService = new EmailService(db, authService);

export const sendEmail = actionClient
    .schema(sendEmailSchema)
    .action(async ({ parsedInput: emailData }) => {
        try {
            // Envoi de l'email et récupération de la réponse
            const { data } = await axiosInstance.post<ResendData>('/email-send', emailData);

            // Mise à jour de la date de relance
            const dateRelanceOptimale = new Date();
            dateRelanceOptimale.setDate(dateRelanceOptimale.getDate() + 7);

            const updatedData = await emailService.sendEmail(
                emailData,
                dateRelanceOptimale,
                data
            );

            const updatedProspect = formatFirebaseDates({ ...updatedData });

            revalidatePath('/dashboard');

            return {
                data: updatedProspect,
                message: 'Email envoyé avec succès et date de relance mise à jour'
            };
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            return {
                failure: 'Erreur lors de l\'envoi de l\'email',
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    });

export const getEmailTemplates = async () => {
    try {
        const templates = await emailService.getEmailTemplates();
        return templates;
    } catch (error) {
        return {
            failure: 'Erreur lors de la récupération des templates',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};

export const getProspectsToFollowUp = async () => {
    try {

        const snapshot = await emailService.getDateRelanceOptimale();

        const prospects = await Promise.all(
            snapshot.map(async (doc) => {
                const prospectData = doc.data();
                const lastEmail = await emailService.getLastEmailForProspect(doc.id);
                return {
                    ...prospectData,
                    id: doc.id,
                    lastEmail: lastEmail
                };
            })
        );

        return {
            data: prospects.map(prospect => formatFirebaseDates(prospect)),
            message: 'Prospects à relancer récupérés avec succès'
        };
    } catch (error) {
        return {
            failure: 'Erreur lors de la récupération des prospects à relancer',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};

export const getFollowUpCount = async () => {
    try {
        const { count, lastUpdate } = await emailService.getFollowUpCount();
        return {
            data: { count, lastUpdate: formatFirebaseDates({ lastUpdate }) },
            message: 'Nombre de prospects à relancer récupéré avec succès'
        };
    } catch (error) {
        console.error('Erreur getFollowUpCount:', error);
        return {
            failure: 'Erreur lors de la récupération du nombre de prospects à relancer',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};

export const getLastEmailForProspect = async (prospectId: string) => {
    const lastEmail = await emailService.getLastEmailForProspect(prospectId);
    return formatFirebaseDates(lastEmail);
};

export const updateEmailStatus = async (emailId: string) => {
    try {
        // Récupération du statut via Resend
        const { data } = await axiosInstance.get(`/email-send?id=${emailId}`);

        if (data) {
            await emailService.updateEmailStatus(emailId, data);
            return {
                data: formatFirebaseDates(data),
                message: 'Statut de l\'email mis à jour avec succès'
            };
        }

        return {
            failure: 'Statut non disponible'
        };
    } catch (error) {
        console.error('Erreur updateEmailStatus:', error);
        return {
            failure: 'Erreur lors de la mise à jour du statut',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};

export const getEmailStatus = async (emailId: string) => {
    try {
        const status = await emailService.getEmailStatus(emailId);

        return {
            data: status,
            message: 'Statut de l\'email récupéré avec succès'
        };
    } catch (error) {
        return {
            failure: 'Erreur lors de la récupération du statut de l\'email',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};

export const getEmailHistory = async () => {
    try {
        const emails = await emailService.getEmailHistory();
        return {
            data: emails.map(email => formatFirebaseDates(email)),
            message: 'Historique des emails récupéré avec succès'
        };
    } catch (error) {
        return {
            failure: 'Erreur lors de la récupération de l\'historique des emails',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};

export const deleteEmail = actionClient
    .schema(deleteEmailSchema)
    .action(async ({ parsedInput: emailId }) => {
        try {
            await emailService.deleteEmail(emailId.id);
            revalidatePath('/dashboard/emails/history');
            return {
                message: 'Email supprimé avec succès'
            };
        } catch (error) {
            return {
                failure: 'Erreur lors de la suppression de l\'email',
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    });

export const getEmailById = async (emailId: string) => {
    try {
        const email = await emailService.getEmailById(emailId);
        return {
            data: formatFirebaseDates(email),
            message: 'Email récupéré avec succès'
        };
    } catch (error) {
        return {
            failure: 'Erreur lors de la récupération de l\'email',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};


