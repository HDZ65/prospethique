import { z } from 'zod';

export const schemaMail = z.object({
  email: z.string().email('L\'email doit être valide'),
  objet: z.string().optional(),
  message: z.string(),
});

export const schemaMailWithId = schemaMail.extend({
  id: z.string().min(1, "L'ID est requis")
});

export type Mail = z.infer<typeof schemaMail>;
export type MailWithId = z.infer<typeof schemaMailWithId>;