'use server';

import { actionClient } from "@/libs/safe-action";
import { GenerateLinkedinPostSchema } from "@/libs/schemas/linkedin.schema";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
/**
 * @title Action Serveur pour la génération de posts LinkedIn
 * @description Gère la création de posts LinkedIn en utilisant Claude AI
 */
export const createLinkedinPost = actionClient
  .schema(GenerateLinkedinPostSchema)
  .action(async ({ parsedInput}) => {
    try {
      console.log('🔄 Construction du prompt...');
      const prompt = `En tant qu'expert en marketing digital et communication sur LinkedIn, crée un post professionnel et engageant avec les spécifications suivantes. Écrivez uniquement un post LinkedIn professionnel et engageant avec les éléments suivants, sans autre commentaire ou explication.

      CONTEXTE :
      - Objectif principal : ${parsedInput.objective}
      - Public cible : ${parsedInput.targetAudience}
      - Sujet : ${parsedInput.topic}
      
      STYLE ET TON :
      - Ton de communication : ${parsedInput.tone}
      - Utilise des émojis pertinents et professionnels
      - Adopte un style direct et impactant
      - Inclus des espaces et des sauts de ligne pour une meilleure lisibilité
      
      CONTENU REQUIS :
      - Intègre naturellement ces mots-clés : ${parsedInput.keywords}
      - Call-to-action principal : ${parsedInput.callToAction}
      - Contexte additionnel à considérer : ${parsedInput.additionalContext}
      
      STRUCTURE DU POST :
      1. Accroche percutante qui capte l'attention en 1-2 lignes
      2. Histoire ou contexte qui crée une connexion émotionnelle
      3. 2-3 points clés ou enseignements principaux
      4. Preuve sociale ou données statistiques si pertinent
      5. Call-to-action clair et incitatif
      6. 3-5 hashtags stratégiques et pertinents
      
      CONTRAINTES TECHNIQUES :
      - Longueur optimale : entre 1200-1500 caractères
      - Évite les liens dans le corps du texte
      - Utilise des tirets ou des puces pour les listes
      - Inclus des questions rhétoriques pour encourager l'engagement
      
      BONNES PRATIQUES LINKEDIN :
      - Commence fort avec une accroche personnelle ou une question provocante
      - Utilise la technique AIDA (Attention, Intérêt, Désir, Action)
      - Encourage l'engagement avec une question finale
      - Maintiens un ton authentique et professionnel
      
      FORMATAGE REQUIS :
      - Utilisez des sauts de ligne simples entre les paragraphes
      - Préfixez les éléments de liste avec des tirets (-)
      - Séparez clairement les sections avec des lignes vides
      - Placez les hashtags à la fin du post sur une nouvelle ligne
      `;

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022", 
        max_tokens: 500, 
        temperature: 0.7,
        system: "Vous êtes un expert en marketing digital et communication sur LinkedIn, qui crée des posts professionnels et engageants.",
        messages: [{ role: "user", content: prompt }]
      });
      return {
        message: "Post LinkedIn généré !",
        post: response.content[0].type === 'text' 
          ? response.content[0].text 
          : 'Erreur: Contenu non textuel reçu'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      return {
        message: "Erreur lors de la génération du post LinkedIn",
        error: error
      };
    }
  });

