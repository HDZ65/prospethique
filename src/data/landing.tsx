import { Target, Handshake, LineChart } from "lucide-react";

export const landingConfig = {
    features: [
        {
            icon: <Target className="h-6 w-6 text-primary" aria-hidden="true" />,
            title: "Prospection ciblée",
            description: "Identifiez et contactez les prospects les plus pertinents pour votre activité"
        },
        {
            icon: <Handshake className="h-6 w-6 text-primary" aria-hidden="true" />,
            title: "Approche éthique",
            description: "Respectez la vie privée et les préférences de vos prospects"
        },
        {
            icon: <LineChart className="h-6 w-6 text-primary" aria-hidden="true" />,
            title: "Suivi efficace",
            description: "Gérez et suivez vos interactions de manière organisée et professionnelle"
        }
    ],
    hero: {
        title: "La prospection éthique et efficace",
        subtitle: "Développez votre réseau professionnel de manière responsable et durable"
    },
    cta: {
        title: "Prêt à développer votre réseau de manière éthique ?",
        subtitle: "Rejoignez ProspEthique aujourd'hui et transformez votre approche de la prospection"
    }
};