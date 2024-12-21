import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const schemaLinkedin = zfd.formData({
    objective: zfd.text(z.string().min(1, "L'objectif est requis")),
    targetAudience: zfd.text(z.string().min(1, "La cible est requise")),
    tone: zfd.text(z.string().min(1, "Le ton est requis")),
    keywords: zfd.text(z.string().optional()),
    topic: zfd.text(z.string().min(1, "Le sujet est requis")),
    callToAction: zfd.text(z.string().min(1, "L'appel à l'action est requis")),
    additionalContext: zfd.text(z.string().optional())
});
