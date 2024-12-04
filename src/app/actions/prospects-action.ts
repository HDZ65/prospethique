'use server'

import { db } from '@/lib/firebase-admin';
import { Prospect } from '@/schemas';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function getProspects() {
  try {
    const prospectsSnapshot = await db.collection('prospects')
      .orderBy('dateCreation', 'desc')
      .get();
    
    return prospectsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        entreprise: data.entreprise,
        contact: data.contact,
        email: data.email,
        statut: data.statut,
        notes: data.notes,
        dateCreation: (data.dateCreation as Timestamp).toDate().toISOString(),
        dateRelanceOptimale: (data.dateRelanceOptimale as Timestamp).toDate().toISOString()
      };
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des prospects:', error);
    return [];
  }
}

export async function updateProspect(id: string, data: Partial<Prospect>) {
  try {
    await db.collection('prospects').doc(id).update(data);
    revalidatePath('/prospects');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prospect:', error);
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }
}

export async function deleteProspect(id: string) {
  try {
    await db.collection('prospects').doc(id).delete();
    revalidatePath('/prospects');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du prospect:', error);
    return { success: false, error: 'Erreur lors de la suppression' };
  }
} 