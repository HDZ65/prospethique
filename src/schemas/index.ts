import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';

// Énumérations principales
export const STATUTS = ['Email envoyé', 'Accepté', 'À contacter', 'Relance', 'Refusé'] as const;

// 2. Simplifier le type Prospect
export const schemaProspect = z.object({
  entreprise: z.string().min(2),
  contact: z.string().min(2),
  email: z.string().email(),
  statut: z.enum(STATUTS),
  notes: z.string(),
  dateRelanceOptimale: z.any(),
  dateCreation: z.any(),
});

// Dériver le type depuis le schéma
export type Prospect = z.infer<typeof schemaProspect>;
