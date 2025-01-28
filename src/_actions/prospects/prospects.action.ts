'use server'

import { db } from '@/lib/firebase/firebase-admin';
import { schemaProspect, deleteProspectSchema, ProspectWithId, updateProspectSchema } from '@/lib/schemas/prospect-schema';
import { revalidatePath } from 'next/cache';
import { ProspectService } from '@services/prospects/prospects.service';
import { actionClient } from "@/lib/safe-action";
import { AuthService } from '@services/auth/auth.service';
import { Timestamp } from 'firebase-admin/firestore';
import { formatFirebaseDate, formatFirebaseDates, toFirebaseTimestamps } from '@/lib/utils/date';

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
export const getProspects = async () => {
  try {
    const prospects = await prospectService.getAllProspects();
    return prospects;
  } catch (error) {
    return {
      failure: 'Erreur lors de la récupération des prospects',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// CREATE
export const addProspect = actionClient
  .schema(schemaProspect)
  .action(async ({ parsedInput: prospectData }) => {
    try {
      const prospectWithDates = {
        ...prospectData,
        dateCreation: Timestamp.now(),
      };

      // Création dans la base de données
      const id = await prospectService.createProspect(prospectWithDates);

      revalidatePath('/dashboard');
      return {
        message: 'Prospect ajouté avec succès',
        prospect: {
          ...prospectData,
          id,
          dateCreation: formatFirebaseDate(Timestamp.now()),
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
      const updateData = toFirebaseTimestamps({
        ...prospectData,
        updatedAt: new Date().toISOString()
      });

      await prospectService.updateProspect(updateData);
      const updatedProspect = await prospectService.getProspectById(prospectData.id);

      revalidatePath('/dashboard');
      return {
        data: formatFirebaseDates(updatedProspect),
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
  .action(async ({ parsedInput: { id, deleteEmails } }) => {
    try {
      await prospectService.deleteProspect(id, deleteEmails);
      revalidatePath('/dashboard');
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
export const getProspectById = async (id: string) => {
  try {
    const prospect = await prospectService.getProspectById(id);
    return prospect ? formatFirebaseDates(prospect) : null;
  } catch (error) {
    return null;
  }
}


