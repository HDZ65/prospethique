export interface Template {
  id: string | number
  name: string
  category: string
  description?: string
  content: string
  isCustom?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Prospect {
  id: string
  prenom: string
  nom: string
  email: string
  poste?: string
  entreprise?: string
  linkedin?: string
  telephone: string
  notes: string
  createdAt?: Date
  updatedAt?: Date
  date_proposition?: string
}

export interface TextBlock {
  id: string
  content: string
  type: 'text' | 'button' | 'image' | 'custom'
  buttonProps?: Record<string, any>
}

export interface ScheduledEmail {
  id: string
  content: string
  recipient: string
  scheduledDate: Date
  status: 'pending' | 'sent' | 'failed'
}

// Ajouté : Interface pour l'historique des emails
export interface EmailHistory {
  id: string;
  recipient: string;
  subject: string;
  contentPreview: string;
  sentDate: Date;
  status?: string | 'sent' | 'draft' | 'failed';
  engagement?: {
    opened?: boolean;
    clicked?: boolean;
    replied?: boolean;
    openedAt?: Date;
    clickedAt?: Date;
  };
}

// Ajouter les types manquants si besoin
export interface LinkedInData {
  profileUrl?: string;
  derniereSynchronisation?: Date;
  activites?: any[];
  opportunites?: any[];
}

export interface Suggestion {
  id: string;
  text: string;
  category: string;
} 