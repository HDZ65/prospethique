export const CATEGORIES = {
  PERFORMANCE: 'Performance',
  SEO: 'SEO',
  ACCESSIBILITY: 'Accessibilité',
  SECURITY: 'Sécurité',
  CONTENT: 'Contenu',
  TECHNICAL: 'Technique',
  UX: 'Expérience Utilisateur',
  MOBILE: 'Mobile',
  ANALYTICS: 'Analytique',
  SOCIAL: 'Réseaux Sociaux',
} as const;

export const AUDIT_STEPS = [
  {
    id: 1,
    title: 'Information',
    description: 'Informations du client et du site',
    icon: '📋'
  },
  {
    id: 2,
    title: 'Analyse',
    description: 'Analyse technique du site',
    icon: '🔍'
  },
  {
    id: 3,
    title: 'Évaluation',
    description: 'Notation et commentaires',
    icon: '✍️'
  },
  {
    id: 4,
    title: 'Rapport',
    description: 'Génération du rapport final',
    icon: '📊'
  }
] as const; 