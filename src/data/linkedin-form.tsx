// Constants
export const FORM_FIELDS = {
    leftColumn: [
        {
            id: 'objective',
            label: 'Objectif du post',
            type: 'select',
            required: true,
            options: [
                { value: '', label: 'Sélectionnez un objectif' },
                { value: 'partager_une_expertise', label: 'Partager une expertise' },
                { value: 'générer_des_leads', label: 'Générer des leads' },
                { value: 'développer_son_réseau', label: 'Développer son réseau' },
                { value: 'partager_un_succès', label: 'Partager un succès' },
                { value: 'insights_sectoriels', label: 'Insights sectoriels' },
                { value: 'promouvoir_un_événement', label: 'Promouvoir un événement' }
            ]
        },
        {
            id: 'targetAudience',
            label: 'Public cible',
            type: 'select',
            required: true,
            options: [
                { value: '', label: 'Sélectionnez votre public cible' },
                { value: 'dirigeants_de_entreprises', label: "Dirigeants d'entreprises" },
                { value: 'développeurs_senior', label: 'Développeurs senior' },
                { value: 'responsables_RH', label: 'Responsables RH' },
                { value: 'responsables_marketing', label: 'Responsables marketing' },
                { value: 'entrepreneurs', label: 'Entrepreneurs' },
                { value: 'fondateurs_startups', label: 'Fondateurs de startups' },
                { value: 'professionnels_de_la_vente', label: 'Professionnels de la vente' },
                { value: 'consultants', label: 'Consultants' },
                { value: 'chefs_de_projet', label: 'Chefs de projet' },
                { value: 'investisseurs', label: 'Investisseurs' }
            ]
        },
        {
            id: 'tone',
            label: 'Ton du message',
            type: 'select',
            required: true,
            options: [
                { value: '', label: 'Sélectionnez un ton' },
                { value: 'professionnel', label: 'Professionnel' },
                { value: 'décontracté', label: 'Décontracté' },
                { value: 'inspirant', label: 'Inspirant' },
                { value: 'éducatif', label: 'Éducatif' },
                { value: 'narratif', label: 'Narratif' }
            ]
        },
        {
            id: 'keywords',
            label: 'Mots-clés principaux (optionnel)',
            type: 'text',
            placeholder: 'Séparez les mots-clés par des virgules',
            helpText: 'Ajoutez 3-5 mots-clés pertinents pour votre post'
        }
    ],
    rightColumn: [
        {
            id: 'topic',
            label: 'Sujet et contexte principal',
            type: 'textarea',
            required: true,
            placeholder: 'Décrivez votre sujet de manière engageante...',
            className: 'min-h-[140px]'
        },
        {
            id: 'callToAction',
            label: 'Call-to-action souhaité',
            type: 'select',
            required: true,
            options: [
                { value: '', label: 'Sélectionnez votre call-to-action' },
                { value: 'prendre_rendez_vous', label: 'Prendre rendez-vous' },
                { value: 'télécharger_ressource', label: 'Télécharger la ressource' },
                { value: 'nous_contacter', label: 'Nous contacter' },
                { value: 's_inscrire_à_l_événement', label: "S'inscrire à l'événement" },
                { value: 'visiter_site_web', label: 'Visiter le site web' },
                { value: 'suivre_profil', label: 'Suivre le profil' },
                { value: 'partager_post', label: 'Partager le post' },
                { value: 'laisser_commentaire', label: 'Laisser un commentaire' },
                { value: 's_abonner_newsletter', label: "S'abonner à la newsletter" },
                { value: 'demander_démo', label: 'Demander une démo' }
            ]
        },
        {
            id: 'additionalContext',
            label: 'Contexte additionnel (optionnel)',
            type: 'textarea',
            placeholder: 'Informations complémentaires pour enrichir le post...',
            className: 'min-h-[100px]'
        }
    ]
};
// Styles
export const styles = {
    input: `w-full bg-surface/80 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary shadow-input 
            placeholder-text-tertiary focus:border-primary/30 focus:ring-0 hover:border-white/20 transition-all duration-150`,
    label: "text-sm font-medium text-text-secondary"
};

export type FormFieldType = typeof FORM_FIELDS;