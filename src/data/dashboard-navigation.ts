import {
    Users,
    Mail,
    Settings2,
    Building2,
    BarChart3,
    Calendar,
    Linkedin,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"

export interface NavigationItem {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: number
    items?: {
        title: string
        url: string
    }[]
}

export interface NavigationConfig {
    user: {
        name: string
        email: string
        avatar: string
    }
    teams: {
        name: string
        logo: LucideIcon
        plan: string
    }[]
    navMain: NavigationItem[]
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
    breadcrumbs: {
        [key: string]: string
    }
}

export const navigationConfig: NavigationConfig = {
    user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/user.png",
    },
    teams: [
        {
            name: "Mon Entreprise",
            logo: Building2,
            plan: "Pro",
        },
        {
            name: "Statistiques",
            logo: BarChart3,
            plan: "Basic",
        }
    ],
    navMain: [
        {
            title: "Prospects",
            url: "/dashboard",
            icon: Users,
            isActive: true,
            items: [
                {
                    title: "Liste des prospects",
                    url: "/dashboard/prospect/prospects-list",
                },
                {
                    title: "Ajouter un prospect",
                    url: "/dashboard/prospect/add-prospect",
                },
                {
                    title: "À relancer",
                    url: "/dashboard/prospect/follow-up",
                },
            ],
        },
        {
            title: "Emails",
            url: "/emails",
            icon: Mail,
            items: [
                {
                    title: "Générateur",
                    url: "/dashboard/emails/generator"
                },
                {
                    title: "Templates",
                    url: "/dashboard/emails/templates",
                },
                {
                    title: "Historique",
                    url: "/dashboard/emails/history",
                },
            ],
        },
        {
            title:"Linkedin",
            url: "/linkedin",
            icon: Linkedin,
            items: [
                {
                    title: "Post Linkedin",
                    url: "/dashboard/linkedin"
                }
            ]
        },
        {
            title: "Calendrier",
            url: "/calendar",
            icon: Calendar,
            items: [
                {
                    title: "Planning",
                    url: "/dashboard/calendar",
                },
                {
                    title: "Relances prévues",
                    url: "/dashboard/calendar/relances",
                },
            ],
        },
        {
            title: "Paramètres",
            url: "/dashboard/settings",
            icon: Settings2,
            items: [
                {
                    title: "Général",
                    url: "/dashboard/settings",
                },
                {
                    title: "Email",
                    url: "/dashboard/settings/email",
                },
                {
                    title: "Compte",
                    url: "/dashboard/settings/account",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Prospects actifs",
            url: "/dashboard?filter=actifs",
            icon: Users,
        },
        {
            name: "À relancer",
            url: "/dashboard/prospect/follow-up",
            icon: Calendar,
        },
    ],
    breadcrumbs: {
        '/dashboard': 'Liste des prospects',
        '/dashboard/prospect/add-prospect': 'Ajouter un prospect',
        '/dashboard/prospect/follow-up': 'À relancer',
        '/emails/templates': 'Templates d\'emails',
        '/emails/history': 'Historique des emails',
        '/calendar': 'Planning',
        '/calendar/relances': 'Relances prévues',
        '/settings': 'Paramètres généraux',
        '/settings/email': 'Paramètres email',
        '/settings/account': 'Paramètres du compte',
    }
}