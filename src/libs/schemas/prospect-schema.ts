import { z } from 'zod';
import { zfd } from 'zod-form-data';

// Énumérations des statuts
export const STATUTS = ['À contacter', 'Email envoyé', 'Refusé', 'Accepté'] as const;

// Schéma de base (sans ID pour la création)
export const schemaProspect = zfd.formData({
  site: zfd.text(
    z.string({
      required_error: "L'URL du site est requise",
      invalid_type_error: "L'URL doit être une chaîne de caractères"
    }).url('L\'URL du site n\'est pas valide (ex: https://www.exemple.fr)')
  ),
  contact: zfd.text(
    z.string({
      required_error: "Le nom du contact est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères"
    }).min(2, 'Le nom du contact doit contenir au moins 2 caractères')
      .max(100, 'Le nom du contact ne doit pas dépasser 100 caractères')
  ),
  email: zfd.text(
    z.string({
      required_error: "L'email est requis",
      invalid_type_error: "L'email doit être une chaîne de caractères"
    }).email('L\'adresse email n\'est pas valide (ex: contact@exemple.fr)')
      .min(5, 'L\'email est trop court')
      .max(100, 'L\'email ne doit pas dépasser 100 caractères')
  ),
  statut: zfd.text(
    z.enum(STATUTS, {
      required_error: "Le statut est requis",
      invalid_type_error: "Le statut n'est pas valide",
      description: "Statut du prospect"
    })
  ),
  notes: zfd.text(
    z.string({
      invalid_type_error: "Les notes doivent être une chaîne de caractères"
    })
      .max(1000, 'Les notes ne doivent pas dépasser 1000 caractères')
      .optional()
      .transform(val => val || '')
  ),
});

// Schéma pour la mise à jour (avec ID)
export const schemaProspectWithId = zfd.formData({
  ...schemaProspect._def.schema.shape,
  id: zfd.text(
    z.string().min(1, "L'ID est requis")
  )
});

export const updateProspectSchema = zfd.formData({
  ...schemaProspectWithId._def.schema.shape,
  dateRelanceOptimale: zfd.text(
    z.string({
      required_error: "La date de relance est requise",
    }).datetime("La date de relance n'est pas valide")
  ),
});

// Schéma pour la suppression
export const deleteProspectSchema = zfd.formData({
  id: zfd.text(z.string().min(1, "L'ID est requis"))
});

// Schéma pour la récupération par ID
export const getProspectByIdSchema = zfd.formData({
  id: zfd.text(z.string().min(1, "L'ID est requis"))
});


// Types dérivés
export type Prospect = z.infer<typeof schemaProspect>;
export type ProspectWithId = z.infer<typeof schemaProspectWithId> & {
  dateCreation: string;
  dateRelanceOptimale: string;
  updatedAt?: string;
};
export type DeleteProspect = z.infer<typeof deleteProspectSchema>;
export type AddProspect = z.infer<typeof schemaProspect> & { id: string, prospect: ProspectWithId };
export type GetProspectById = z.infer<typeof getProspectByIdSchema>;
export type UpdateProspect = z.infer<typeof updateProspectSchema>;
