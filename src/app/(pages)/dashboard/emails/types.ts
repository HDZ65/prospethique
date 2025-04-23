export interface EmailBlock {
  id: string
  content: string
  type: 'template' | 'custom'
}

export interface Prospect {
  id: number
  prenom: string
  email: string
  date_proposition?: string
  notes?: string
  linkedInData?: LinkedInData
}

export interface Template {
  id: number
  name: string
  content: string
  category: 'commercial' | 'event' | 'followup' | 'other' | 'relance' | 'remerciement' | 'invitation' | 'presentation' | 'devis' | 'newsletter'
  description?: string
  isCustom?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface LinkedInData {
  profileUrl: string
  derniereSynchronisation: Date
  activites: {
    type: 'post' | 'like' | 'comment' | 'share'
    date: Date
    contenu: string
  }[]
  opportunites: {
    type: 'promotion' | 'nouveau_poste' | 'publication'
    date: Date
    description: string
  }[]
}

export interface Suggestion {
  id: string
  text: string
  category: 'introduction' | 'valorisation' | 'proposition' | 'conclusion' | 'relance' | 'remerciement' | 'accroche' | 'transition' | 'objection' | 'benefices'
}

export interface ScheduledEmail {
  id: string
  content: string
  recipient: string
  scheduledDate: Date
  status: 'pending' | 'sent' | 'failed'
}

export interface EmailHistory {
  id: string
  recipient: string
  subject: string
  content: string
  sentAt: Date
  status: 'sent' | 'failed'
  engagement?: {
    opened: boolean
    clicked: boolean
    replied: boolean
    openedAt?: Date
    clickedAt?: Date
    repliedAt?: Date
  }
} 