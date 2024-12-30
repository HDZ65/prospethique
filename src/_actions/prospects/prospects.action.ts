'use server'

import { db } from '@/libs/firebase/firebase-admin';
import { schemaProspect, schemaProspectWithId, deleteProspectSchema, ProspectWithId, getProspectByIdSchema, updateProspectSchema } from '@/libs/schemas/prospect-schema';
import { revalidatePath } from 'next/cache';
import { ProspectService } from '@services/prospects/prospects.service';
import { actionClient } from "@/libs/safe-action";
import { AuthService } from '@services/auth/auth.service';
import { Timestamp } from 'firebase-admin/firestore';

// Types de retour pour les actions
export type AddProspectActionResult = {
  data: {
    message: string;
    prospect: ProspectWithId;
  };
};

const authService = new AuthService();
const prospectService = new ProspectService(db, authService);

// GET
export const getProspects = actionClient
  .action(async () => {
    try {
      const prospects = await prospectService.getAllProspects();
      revalidatePath('/prospects');
      return prospects;
    } catch (error) {
      return {
        failure: 'Erreur lors de la récupération des prospects',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  });

// CREATE
export const addProspect = actionClient
  .schema(schemaProspect)
  .action(async ({ parsedInput: prospectData }) => {
    try {
      // Création des dates
      const dateCreation = Timestamp.now();
      const dateRelanceOptimale = new Date();
      dateRelanceOptimale.setDate(dateCreation.toDate().getDate() + 7);

      // Ajout des dates au prospect
      const prospectWithDates = {
        ...prospectData,
        dateCreation,
        dateRelanceOptimale: Timestamp.fromDate(dateRelanceOptimale),
      };

      // Création dans la base de données
      const id = await prospectService.createProspect(prospectWithDates);

      revalidatePath('/prospects');
      return {
        message: 'Prospect ajouté avec succès',
        prospect: {
          ...prospectData,
          id,
          dateCreation: dateCreation.toDate().toISOString(),
          dateRelanceOptimale: dateRelanceOptimale.toISOString(),
        }
      };
    } catch (error) {
      return {
        failure: 'Erreur lors de la création du prospect',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  });

// UPDATE
export const updateProspect = actionClient
  .schema(updateProspectSchema)
  .action(async ({ parsedInput: prospectData }) => {
    try {
      await prospectService.updateProspect(
        prospectData.id,
        {
          ...prospectData,
          dateRelanceOptimale: prospectData.dateRelanceOptimale,
        }
      );
      
      const updatedProspect = await prospectService.getProspectById(prospectData.id);
      revalidatePath('/prospects');
      
      return {
        data: updatedProspect,
        message: 'Prospect mis à jour avec succès'
      };
    } catch (error) {
      return {
        failure: 'Erreur lors de la mise à jour du prospect',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  });

// DELETE
export const deleteProspect = actionClient
  .schema(deleteProspectSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      // Suppression avec vérification de propriété
      await prospectService.deleteProspect(id);
      revalidatePath('/prospects');
      return {
        data: true,
        message: 'Prospect supprimé avec succès'
      };
    } catch (error) {
      return {
        failure: 'Erreur lors de la suppression du prospect',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  });

// GET BY ID
export async function getProspect(id: string) {
  try {
    return await prospectService.getProspectById(id);
  } catch (error) {
    return null;
  }
}

