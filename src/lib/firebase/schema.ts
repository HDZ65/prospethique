/**
 * Schémas Firestore pour l'application de Prospection
 * Ce fichier définit les types et les interfaces pour la base de données
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Interface principale pour un Prospect
 * Définit la structure d'un document prospect dans Firestore
 */
export interface Interaction {
  id: string;
  prospectId: string;
  type: 'Email' | 'Appel' | 'Réunion' | 'Autre';
  date: Timestamp;
  description: string;
  resultat?: string;
  createdAt: Timestamp;
}

export interface ProspectSchema {
  // Informations de base
  entreprise: string;
  contact: string;
  email: string;
  
  // Suivi
  statut: 'À contacter' | 'Email envoyé' | 'Relance' | 'Accepté' | 'Refusé';
  dernierContact: string;
  notes: string;
  
  // Gestion des relances
  aRepondu: boolean;
  prochaineRelance?: Timestamp;
  nombreRelances: number;
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Tags et catégorisation
  tags: string[];
  secteurActivite: string;
  tailleSociete: keyof typeof TAILLES_ENTREPRISE;
  budgetEstime?: number;
  sourceProspect: keyof typeof SOURCES_PROSPECT;
  
  // Pipeline de vente
  etapePipeline: keyof typeof ETAPES_PIPELINE;
  probabilite: number; // 0-100
  valeurPotentielle: number;
  interactions: Interaction[];
  taches: TacheSchema[];
  
  // Nouveaux champs pour le suivi commercial
  technologiesUtilisees: string[]; // Technologies utilisées par l'entreprise
  besoinIdentifie?: string; // Besoin spécifique identifié
  interetPotentiel: 'Faible' | 'Moyen' | 'Fort';
  dateRelanceOptimale: Timestamp; // Date calculée pour la relance
  historiqueEmails: {
    date: Timestamp;
    type: 'Premier contact' | 'Relance';
    contenu: string;
  }[];
  
  // Suivi des interactions
  dernierContactType: 'Email' | 'Téléphone' | 'LinkedIn' | 'Autre';
  prochaineAction?: {
    type: 'Relance' | 'RDV' | 'Devis';
    date: Timestamp;
    notes: string;
  };
}

/**
 * Interface pour les notifications
 * Gère les alertes de relance et les rappels
 */
export interface NotificationSchema {
  id: string;
  prospectId: string;
  type: 'RelanceNecessaire' | 'VerifierReponse';
  message: string;
  dateCreation: Timestamp;
  dateEcheance: Timestamp;
  statut: 'Active' | 'Vue' | 'Traitée' | 'Ignorée';
  priorite: 'Haute' | 'Normale' | 'Basse';
}

/**
 * Interface pour les relances programmées
 * Gère les rappels et les suivis à faire
 */
export interface RelanceSchema {
  prospectId: string;
  dateRelance: Timestamp;
  type: 'Email' | 'Appel' | 'Autre';
  statut: 'Planifiée' | 'Effectuée' | 'Annulée';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Type pour les statistiques de prospection
 * Utilisé pour le tableau de bord et les analyses
 */
export interface StatistiqueSchema {
  periode: string; // ex: "2024-01", "2024-Q1"
  totalProspects: number;
  nouveauxProspects: number;
  emailsEnvoyes: number;
  relancesEffectuees: number;
  conversions: number;
  tauxConversion: number;
  updatedAt: Timestamp;
}

// Structure de la base de données
export const DB_STRUCTURE = {
  collections: {
    prospects: 'prospects',
    interactions: 'interactions',
    relances: 'relances',
    notifications: 'notifications',
    statistiques: 'statistiques'
  },
  // Sous-collections pour chaque prospect
  subCollections: {
    interactions: 'interactions',
    relances: 'relances'
  }
};

// Règles de validation
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  entreprise: {
    minLength: 2,
    maxLength: 100
  },
  notes: {
    maxLength: 1000
  },
  relance: {
    delaiJours: 7,
    maxRelances: 3
  }
};

// Constantes pour les statuts
export const STATUTS = {
  A_CONTACTER: 'À contacter',
  EMAIL_ENVOYE: 'Email envoyé',
  RELANCE: 'Relance',
  ACCEPTE: 'Accepté',
  REFUSE: 'Refusé'
} as const;

// Types d'interactions
export const TYPES_INTERACTION = {
  EMAIL: 'Email',
  APPEL: 'Appel',
  REUNION: 'Réunion',
  AUTRE: 'Autre'
} as const;

// Types de notifications
export const TYPES_NOTIFICATION = {
  RELANCE_NECESSAIRE: 'RelanceNecessaire',
  VERIFIER_REPONSE: 'VerifierReponse'
} as const;

// Priorités des notifications
export const PRIORITES_NOTIFICATION = {
  HAUTE: 'Haute',
  NORMALE: 'Normale',
  BASSE: 'Basse'
} as const;

export const ETAPES_PIPELINE = {
  PREMIER_CONTACT: 'Premier contact',
  QUALIFICATION: 'Qualification',
  PROPOSITION: 'Proposition',
  NEGOCIATION: 'Négociation',
  GAGNE: 'Gagné',
  PERDU: 'Perdu'
} as const;

// Ajout des nouveaux types
export const TAILLES_ENTREPRISE = {
  TPE: 'TPE',
  PME: 'PME',
  GE: 'Grande Entreprise'
} as const;

export const SOURCES_PROSPECT = {
  LINKEDIN: 'LinkedIn',
  SITE_WEB: 'Site Web',
  REFERENCE: 'Référence',
  AUTRE: 'Autre'
} as const;

export interface TacheSchema {
  id: string;
  titre: string;
  description?: string;
  dateEcheance: Timestamp;
  priorite: keyof typeof PRIORITES;
  statut: 'à faire' | 'en cours' | 'terminée';
  prospectId: string;
  dateCreation: Timestamp;
}

export const PRIORITES = {
  HAUTE: 'Haute',
  MOYENNE: 'Moyenne',
  BASSE: 'Basse'
} as const;

// Nouveau type pour les modèles d'emails
export interface EmailTemplate {
  id: string;
  nom: string;
  sujet: string;
  contenu: string;
  variables: string[]; // Ex: ['{entreprise}', '{contact}']
  type: 'Premier contact' | 'Relance 1' | 'Relance 2' | 'Relance finale';
} 