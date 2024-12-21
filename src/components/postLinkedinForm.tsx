"use client"

import { createLinkedinPost } from '@/app/actions/postLinkedin-action';
import { FileText } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { LoginButton } from './login-linkedin';

// Styles
const inputStyles = `w-full bg-surface/80 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary shadow-input placeholder-text-tertiary focus:border-primary/30 focus:ring-0 hover:border-white/20 transition-all duration-150`;
const labelStyles = "text-sm font-medium text-text-secondary";

// Définir l'interface des props
interface PostLinkedinFormProps {
  onPostGenerated?: (post: string) => void;
}

export const PostLinkedinForm = ({ onPostGenerated }: PostLinkedinFormProps) => {
  const { execute, result, hasErrored, hasSucceeded, isExecuting } = useAction(createLinkedinPost);

  // Ajouter un useEffect pour surveiller le résultat
  useEffect(() => {
    if (result?.data?.post && onPostGenerated) {
      onPostGenerated(result.data.post);
    }
  }, [result, onPostGenerated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    execute(formData);
  };

  return (
    <div className="flex gap-8 mx-auto flex-1 ">
      {/* Formulaire - environ 2/3 de la largeur */}
      <section className="  bg-gradient-glass backdrop-blur-glass rounded-lg p-6 border border-white/10 shadow-glass">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-surface/80 border border-white/5">
              <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
            </span>
            <h1 id="form-title" className="text-xl font-medium text-text-primary">
              Nouveau post LinkedIn
            </h1>
          </div>
          <LoginButton />

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="sr-only">Informations du post LinkedIn</legend>

            {/* Layout en deux colonnes */}
            <div className="grid grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-5">
                {/* Objectif */}
                <div className="space-y-2">
                  <label htmlFor="objective" className={labelStyles}>Objectif du post</label>
                  <select
                    name="objective"
                    id="objective"
                    className={inputStyles}
                    required
                    aria-required="true"
                  >
                    <option value="">Sélectionnez un objectif</option>
                    <option value="partager_une_expertise">Partager une expertise</option>
                    <option value="générer_des_leads">Générer des leads</option>
                    <option value="développer_son_réseau">Développer son réseau</option>
                    <option value="partager_un_succès">Partager un succès</option>
                    <option value="insights_sectoriels">Insights sectoriels</option>
                    <option value="promouvoir_un_événement">Promouvoir un événement</option>
                  </select>
                </div>

                {/* Public cible */}
                <div className="space-y-2">
                  <label htmlFor="targetAudience" className={labelStyles}>Public cible</label>
                  <select
                    name="targetAudience"
                    id="targetAudience"
                    className={inputStyles}
                    required
                    aria-required="true"
                  >
                    <option value="">Sélectionnez votre public cible</option>
                    <option value="dirigeants_de_entreprises">Dirigeants d&apos;entreprises</option>
                    <option value="développeurs_senior">Développeurs senior</option>
                    <option value="responsables_RH">Responsables RH</option>
                    <option value="responsables_marketing">Responsables marketing</option>
                    <option value="entrepreneurs">Entrepreneurs</option>
                    <option value="fondateurs_startups">Fondateurs de startups</option>
                    <option value="professionnels_de_la_vente">Professionnels de la vente</option>
                    <option value="consultants">Consultants</option>
                    <option value="chefs_de_projet">Chefs de projet</option>
                    <option value="investisseurs">Investisseurs</option>
                  </select>
                </div>

                {/* Ton du message */}
                <div className="space-y-2">
                  <label htmlFor="tone" className={labelStyles}>Ton du message</label>
                  <select
                    name="tone"
                    id="tone"
                    className={inputStyles}
                    required
                    aria-required="true"
                  >
                    <option value="">Sélectionnez un ton</option>
                    <option value="professionnel">Professionnel</option>
                    <option value="décontracté">Décontracté</option>
                    <option value="inspirant">Inspirant</option>
                    <option value="éducatif">Éducatif</option>
                    <option value="narratif">Narratif</option>
                  </select>
                </div>

                {/* Mots-clés */}
                <div className="space-y-2">
                  <label htmlFor="keywords" className={labelStyles}>Mots-clés principaux (optionnel)</label>
                  <input
                    type="text"
                    name="keywords"
                    id="keywords"
                    className={inputStyles}
                    placeholder="Séparez les mots-clés par des virgules"
                    aria-describedby="keywords-help"
                  />
                  <p id="keywords-help" className="text-xs text-text-tertiary">
                    Ajoutez 3-5 mots-clés pertinents pour votre post
                  </p>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-5">
                {/* Sujet et contexte */}
                <div className="space-y-2">
                  <label htmlFor="topic" className={labelStyles}>Sujet et contexte principal</label>
                  <textarea
                    name="topic"
                    id="topic"
                    placeholder="Décrivez votre sujet de manière engageante..."
                    className={`${inputStyles} min-h-[140px] resize-none`}
                    required
                    aria-required="true"
                  />
                </div>

                {/* Call-to-action */}
                <div className="space-y-2">
                  <label htmlFor="callToAction" className={labelStyles}>Call-to-action souhaité</label>
                  <select
                    name="callToAction"
                    id="callToAction"
                    className={inputStyles}
                    required
                    aria-required="true"
                  >
                    <option value="">Sélectionnez votre call-to-action</option>
                    <option value="prendre_rendez_vous">Prendre rendez-vous</option>
                    <option value="télécharger_ressource">Télécharger la ressource</option>
                    <option value="nous_contacter">Nous contacter</option>
                    <option value="s_inscrire_à_l_événement">S&apos;inscrire à l&apos;événement</option>
                    <option value="visiter_site_web">Visiter le site web</option>
                    <option value="suivre_profil">Suivre le profil</option>
                    <option value="partager_post">Partager le post</option>
                    <option value="laisser_commentaire">Laisser un commentaire</option>
                    <option value="s_abonner_newsletter">S&apos;abonner à la newsletter</option>
                    <option value="demander_démo">Demander une démo</option>
                  </select>
                </div>

                {/* Contexte additionnel */}
                <div className="space-y-2">
                  <label htmlFor="additionalContext" className={labelStyles}>Contexte additionnel (optionnel)</label>
                  <textarea
                    name="additionalContext"
                    id="additionalContext"
                    className={`${inputStyles} min-h-[100px] resize-none`}
                    placeholder="Informations complémentaires pour enrichir le post..."
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {hasSucceeded && <p className="text-green-500 mt-4 text-center">{result?.data?.message}</p>}
          {hasErrored && <p className="text-red-500 mt-4 text-center">
            {result?.serverError || result?.validationErrors?._errors?.[0] || "Erreur inconnue"}
          </p>}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-text-primary font-medium py-3 px-4 rounded-lg shadow-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 mt-6"
            aria-label="Générer le post LinkedIn"
          >
            {isExecuting ? "Génération en cours..." : "Générer le post"}
          </button>

        </form>
      </section>

    </div>
  );
}; 