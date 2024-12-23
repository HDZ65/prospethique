import { z } from 'zod';
import { zfd } from 'zod-form-data';

// Énumérations des statuts
export const STATUTS = ['Email envoyé', 'À contacter', 'Refusé', 'Accepté'] as const;

// Schéma de base (sans ID pour la création)
export const schemaProspect = zfd.formData({
  site: zfd.text(
    z.string().url('L\'URL du site doit être valide')
  ),
  contact: zfd.text(
    z.string().min(2, 'Le nom du contact doit contenir au moins 2 caractères')
  ),
  email: zfd.text(
    z.string().email('L\'email doit être valide')
  ),
  statut: zfd.text(
    z.enum(STATUTS)
  ),
  notes: zfd.text(
    z.string().optional()
  ).optional(),
});

// Schéma pour la mise à jour (avec ID)
export const schemaProspectWithId = zfd.formData({
  ...schemaProspect._def.schema.shape,
  id: zfd.text(
    z.string().min(1, "L'ID est requis")
  ),
});

// Schéma pour la suppression
export const deleteProspectSchema = zfd.formData({
  id: zfd.text(z.string().min(1, "L'ID est requis"))
});

// Types dérivés
export type Prospect = z.infer<typeof schemaProspect>;
export type ProspectWithId = z.infer<typeof schemaProspectWithId> & { dateCreation: string, dateRelanceOptimale: string };
export type DeleteProspect = z.infer<typeof deleteProspectSchema>;
export type AddProspect = z.infer<typeof schemaProspect> & { id: string, prospect: ProspectWithId };
