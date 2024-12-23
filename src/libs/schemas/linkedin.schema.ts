import { z } from 'zod';
import { zfd } from 'zod-form-data';



// Schéma pour la génération de posts LinkedIn
export const GenerateLinkedinPostSchema = zfd.formData({
    objective: zfd.text(z.string().min(1, "L'objectif est requis")),
    targetAudience: zfd.text(z.string().min(1, "La cible est requise")),
    tone: zfd.text(z.string().min(1, "Le ton est requis")),
    keywords: zfd.text(z.string().optional()),
    topic: zfd.text(z.string().min(1, "Le sujet est requis")),
    callToAction: zfd.text(z.string().min(1, "L'appel à l'action est requis")),
    additionalContext: zfd.text(z.string().optional())
});

// Schéma pour la publication de posts LinkedIn
export const PostLinkedInSchema = z.object({
    content: zfd.text(z.string().min(1, "Le contenu est requis")),
    accessToken: zfd.text(z.string().min(1, "Token d'accès requis")),
    userId: zfd.text(z.string().min(1, "ID utilisateur requis")),
});

