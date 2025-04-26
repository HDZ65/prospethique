import { Prospect } from '../types'

export const SAMPLE_PROSPECTS: Prospect[] = [
  {
    id: "1",
    prenom: "Marie",
    nom: "Dubois",
    email: "marie.dubois@entreprise.com",
    poste: "Directrice Marketing",
    entreprise: "Entreprise A",
    linkedin: "linkedin.com/in/marie-dubois",
    telephone: "+33 6 12 34 56 78",
    notes: "Intéressée par nos solutions de marketing automation",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    prenom: "Thomas",
    nom: "Martin",
    email: "thomas.martin@societe.fr",
    poste: "Responsable Commercial",
    entreprise: "Société B",
    linkedin: "linkedin.com/in/thomas-martin",
    telephone: "+33 6 98 76 54 32",
    notes: "A exprimé un besoin en solutions CRM",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16")
  }
] 