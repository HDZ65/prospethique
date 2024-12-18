import { z } from 'zod';
import { schemaProspect, STATUTS } from '@/schemas/prospect-schema';
import { Timestamp } from 'firebase-admin/firestore';
import { schemaMail } from '@/schemas/mail.schema';

// Types de base
export type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: z.ZodIssue[];
};

// Types métier
export type Prospect = z.infer<typeof schemaProspect>;
export type Mail = z.infer<typeof schemaMail>;

export type MailResponse = Mail & {
  id: string;
  dateEnvoi: Timestamp;
};

export type ProspectResponse = Prospect & {
  id: string;
  dateCreation: Timestamp;
};

// Type pour Firestore
export type typeProspect = {
  dateRelanceOptimale: Timestamp;
  site: string;
  contact: string;
  statut: typeof STATUTS[number];
  notes?: string;
  mails?: string[];
};

// Type pour les mails
export type typeMail = {
  email: string;
  objet: string;
  contenu: string;
};