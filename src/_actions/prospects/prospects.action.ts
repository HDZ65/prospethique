'use server'

import { db } from '@/libs/firebase/firebase-admin';
import { schemaProspect, schemaProspectWithId, deleteProspectSchema, ProspectWithId } from '@/libs/schemas/prospect-schema';
import { revalidatePath } from 'next/cache';
import { ProspectService } from '@services/prospects/prospects.service';
import { actionClient } from "@/libs/safe-action";
import { AuthService } from '@services/auth/auth.service';

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
      const id = await prospectService.createProspect(prospectData);
      revalidatePath('/prospects');
      return {
        message: 'Prospect ajouté avec succès',
        prospect: {
          ...prospectData,
          id
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
  .schema(schemaProspectWithId)
  .action(async ({ parsedInput: prospectWithId }) => {
    try {
      // Mise à jour avec vérification de propriété
      await prospectService.updateProspect(
        prospectWithId.id,
        prospectWithId
      );
      revalidatePath('/prospects');
      return {
        data: true,
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