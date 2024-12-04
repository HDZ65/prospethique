'use server'

import { db } from '@/lib/firebase/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function addPersonalReminder(date: Date, notes: string) {
  try {
    const reminderData = {
      date: Timestamp.fromDate(date),
      notes,
      type: 'personal',
      createdAt: Timestamp.now(),
      titre: 'RDV Personnel',
      description: notes,
      statut: 'planifié'
    };

    const docRef = await db.collection('personalReminders').add(reminderData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erreur serveur lors de l\'ajout du RDV:', error);
    return { success: false, error: 'Erreur lors de l\'ajout du RDV' };
  }
}

export async function modifyReminder(prospectId: string, date: Date, notes: string) {
  try {
    await db.doc(`prospects/${prospectId}`).update({
      rdv: {
        date: Timestamp.fromDate(date),
        notes
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur serveur lors de la modification du RDV:', error);
    return { success: false, error: 'Erreur lors de la modification du RDV' };
  }
}

export async function deleteReminder(prospectId: string) {
  try {
    await db.doc(`prospects/${prospectId}`).update({
      rdv: null
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur serveur lors de la suppression du RDV:', error);
    return { success: false, error: 'Erreur lors de la suppression du RDV' };
  }
} 