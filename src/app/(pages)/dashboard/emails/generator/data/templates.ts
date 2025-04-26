import { Template } from "../types"

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Premier Contact",
    category: "Prospection",
    description: "Email initial pour établir un premier contact",
    content: `Bonjour {{prenom}},

J'espère que vous allez bien. Je me permets de vous contacter car j'ai remarqué que {{entreprise}} pourrait bénéficier de nos solutions.

Seriez-vous disponible pour un court échange de 15 minutes cette semaine ?

Cordialement,
[Votre nom]`
  },
  {
    id: "2",
    name: "Suivi Webinar",
    category: "Événement",
    description: "Email de suivi après participation à un webinar",
    content: `Bonjour {{prenom}},

Merci d'avoir participé à notre webinar sur {{sujet}}. J'espère que vous avez trouvé le contenu utile et pertinent.

Je serais ravi(e) d'échanger avec vous sur les points qui ont retenu votre attention et voir comment nous pourrions vous accompagner.

Quelles seraient vos disponibilités pour un appel cette semaine ?

Bien cordialement,
[Votre nom]`
  }
] 