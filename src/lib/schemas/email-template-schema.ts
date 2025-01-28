import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const sendEmailSchema = zfd.formData({
    prospectId: zfd.text(
        z.string({
            required_error: "L'ID du prospect est requis",
            invalid_type_error: "L'ID du prospect doit être une chaîne de caractères"
        }).min(1, "L'ID du prospect est requis").max(100, "L'ID du prospect ne doit pas dépasser 100 caractères")
    ),
    site: zfd.text(z.string({
        required_error: "Le site est requis",
        invalid_type_error: "Le site doit être une chaîne de caractères"
    }).url("L'URL du site n'est pas valide").max(100, "Le site ne doit pas dépasser 100 caractères")),
    contact: zfd.text(
        z.string({
            required_error: "Le nom du contact est requis",
            invalid_type_error: "Le nom du contact doit être une chaîne de caractères"
        }).min(2, "Le nom du contact doit contenir au moins 2 caractères")
            .max(100, "Le nom du contact ne doit pas dépasser 100 caractères")),
    recherche: zfd.text(z.string({
        required_error: "La recherche est requise",
        invalid_type_error: "La recherche doit être une chaîne de caractères"
    }).min(1, "La recherche est requise")
        .max(200, "La recherche ne doit pas dépasser 100 caractères")),
    email: zfd.text(z.string({
        required_error: "L'email est requis",
        invalid_type_error: "L'email doit être une chaîne de caractères"
    }).email("L'adresse email n'est pas valide")
        .min(5, "L'email est trop court")
        .max(100, "L'email ne doit pas dépasser 100 caractères")),
    ameliorationList: zfd.text(
        z.string({
            required_error: "La liste des points d'amélioration est requise",
            invalid_type_error: "La liste des points d'amélioration doit être une chaîne de caractères"
        }).min(1, "La liste des points d'amélioration est requise")
            .max(1000, "La liste des points d'amélioration ne doit pas dépasser 100 caractères")),
    motCle: zfd.text(
        z.string({
            required_error: "Le mot-clé principal est requis",
            invalid_type_error: "Le mot-clé principal doit être une chaîne de caractères"
        }).min(1, "Le mot-clé principal est requis")
            .max(100, "Le mot-clé principal ne doit pas dépasser 100 caractères")),
    numeroPage: zfd.text(
        z.string({
            required_error: "La position dans Google est requise",
            invalid_type_error: "La position dans Google doit être une chaîne de caractères"
        }).min(1, "La position dans Google est requise")
            .max(100, "La position dans Google ne doit pas dépasser 100 caractères"))
});

export type SendEmail = z.infer<typeof sendEmailSchema>;

export type CompleteSendEmail = SendEmail & ResendData;

export type ResendData = {
    object: string;
    id: string;
    to: string[];
    from: string;
    created_at: string;
    subject: string;
    html: string;
    text: string | null;
    bcc: string | null;
    cc: string | null;
    reply_to: string | null;
    last_event: string;
}

export interface EmailStatus {
    id: string;
    status: 'sent' | 'delivered' | 'failed' | 'opened';
    lastChecked: string;
}

export const deleteEmailSchema = zfd.formData({
    id: zfd.text(z.string({
        required_error: "L'ID de l'email est requis",
        invalid_type_error: "L'ID de l'email doit être une chaîne de caractères"
    }))
});

