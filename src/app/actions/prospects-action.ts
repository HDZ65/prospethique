'use server'

import { db } from '@/lib/firebase-admin';
import { schemaProspect, schemaProspectWithId, deleteProspectSchema, ProspectWithId } from '@/schemas/prospect-schema';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { ProspectResponse } from '@/types';
import { actionClient } from "@/lib/safe-action";

// Types de retour pour les actions
export type AddProspectActionResult = {
  data: {
    message: string;
    prospect: ProspectWithId;
  };
};

// GET
export const getProspects = actionClient
  .action(async () => {
    try {

      // Vérification de la connexion à la base de données
      if (!db) {
        throw new Error("Erreur de connexion à la base de données");
      }

      // Récupération des prospects
      const snapshot = await db.collection('prospects')
        .orderBy('dateCreation', 'desc')
        .get();

      // Si aucun prospect n'est trouvé
      if (snapshot.empty) {
        return {
          data: [],
          metadata: {
            total: 0,
            timestamp: new Date().toISOString()
          }
        };
      }

      // Traitement des prospects
      const prospects = snapshot.docs.map(doc => {
        const data = doc.data() as ProspectResponse;

        // Validation des données avec le schéma
        const validatedData = schemaProspect.parse({
          ...data,
        });

        return {
          ...validatedData,
          dateCreation: data.dateCreation.toDate().toISOString(),
          id: doc.id,
        };
      });

      return {
        prospects,
        metadata: {
          total: prospects.length,
          timestamp: new Date().toISOString()
        }
      };

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
      if (!db?.collection('prospects')) {
        throw new Error("Erreur d'accès à la collection prospects");
      }

      const newProspectData = {
        ...prospectData,
        dateCreation: Timestamp.fromDate(new Date()),
        dateRelanceOptimale: Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statut: 'À contacter' as const,
        notes: prospectData.notes || ''
      };

      const docRef = await db.collection('prospects').add(newProspectData);

      if (!docRef.id) {
        throw new Error("Échec de la création du document");
      }

      revalidatePath('/');

      return {
        message: 'Prospect ajouté avec succès',
        prospect: {
          ...prospectData,
          id: docRef.id,
          dateCreation: newProspectData.dateCreation.toDate().toISOString(),
          statut: newProspectData.statut
        }
      };
    } catch (error) {
      console.error('Erreur complète:', error);
      return {
        failure: 'Erreur lors de la création du prospect'
      };
    }
  });

// UPDATE
export const updateProspect = actionClient
  .schema(schemaProspectWithId)
  .action(async ({ parsedInput: prospectWithId }) => {

    try {
      if (!db?.collection('prospects')) {
        throw new Error("Erreur d'accès à la collection prospects");
      }

      await db.collection('prospects').doc(prospectWithId.id).update(prospectWithId);
      revalidatePath('/prospects');
      return { data: true, message: 'Prospect mis à jour avec succès' };
    } catch {
      return { failure: 'Erreur lors de la mise à jour du prospect', error: 'Erreur inconnue' };
    }
  });

// DELETE
export const deleteProspect = actionClient
  .schema(deleteProspectSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      if (!db?.collection('prospects')) {
        throw new Error("Erreur d'accès à la collection prospects");
      }
      await db.collection('prospects').doc(id).delete();
      revalidatePath('/prospects');
      return { data: true, message: 'Prospect supprimé avec succès' };
    } catch {
      return { failure: 'Erreur lors de la suppression du prospect', error: 'Erreur inconnue' };
    }
  });