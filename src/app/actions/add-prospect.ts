'use server'

import { db } from '@/lib/firebase-admin';
import { schemaProspect } from '@/schemas';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

export async function addProspect(data: Record<string, unknown>) {
  try {
    const validatedData = schemaProspect.parse({
      ...data,
      dateCreation: Timestamp.now(),
      dateRelanceOptimale: Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await db.collection('prospects').add(validatedData);
    return { success: true } as const;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du prospect:', error);
    return { 
      success: false, 
      errors: error instanceof z.ZodError ? error.errors : []
    } as const;
  }
} 