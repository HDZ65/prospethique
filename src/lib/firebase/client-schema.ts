/**
 * Schémas Firebase pour le côté client
 * Ces schémas n'utilisent pas les dépendances Node.js
 */

import { z } from 'zod';
import { baseEntitySchema, timestampSchema } from '@/schemas/common';
import { 
  PRIORITES, 
  TYPES_CONTACT,
  NIVEAUX_INTERET,
  TYPES_NOTIFICATION,
  STATUTS 
} from '@/schemas/constants';

// Utilisez les schémas existants mais sans les dépendances Node.js
export const clientProspectSchema = baseEntitySchema.extend({
  // ... reste du schéma
});

// Autres schémas client... 