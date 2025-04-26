export interface Prospect {
  id: string
  prenom: string
  nom: string
  email: string
  entreprise: string
  entreprise_linkedin?: string
  telephone?: string
  poste: string
  date_proposition?: string
  linkedin_url?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Template {
  id: number
  name: string
  category: 'commercial' | 'followup' | 'newsletter'
  description?: string
  content: string
  isCustom?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface LinkedInData {
  headline?: string
  summary?: string
  experience?: Array<{
    title: string
    company: string
    description?: string
    startDate?: string
    endDate?: string
  }>
  education?: Array<{
    school: string
    degree?: string
    field?: string
    startDate?: string
    endDate?: string
  }>
}

export interface Suggestion {
  id: string
  text: string
  category: string
}

export interface ScheduledEmail {
  id: string
  content: string
  recipient: string
  scheduledDate: Date
  subject?: string
  status?: 'pending' | 'sent' | 'failed'
}

export interface EmailHistory {
  id: string
  content: string
  recipient: string
  sentDate: Date
  subject?: string
  engagement?: {
    opened?: boolean
    clicked?: boolean
    replied?: boolean
    openedAt?: Date
    clickedAt?: Date
    repliedAt?: Date
  }
}

export interface TextBlock {
  id: string
  content: string
  type?: 'text' | 'button' | 'custom'
  buttonProps?: {
    url?: string
    backgroundColor?: string
    textColor?: string
    borderRadius?: string
  }
}