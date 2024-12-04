/**
 * Schémas Firebase pour le côté serveur
 * Ces schémas peuvent utiliser les dépendances Node.js
 */

import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';
import { baseEntitySchema } from '@/schemas/common';
// ... autres imports

// Schémas complets avec fonctionnalités serveur
export const serverProspectSchema = baseEntitySchema.extend({
  // ... schéma complet
});

// Autres schémas serveur... 