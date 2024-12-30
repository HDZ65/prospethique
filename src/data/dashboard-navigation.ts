import {
    Users,
    Mail,
    Settings2,
    Building2,
    BarChart3,
    Calendar,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"

export interface NavigationItem {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
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
                    url: "/dashboard/prospect/list-prospects",
                },
                {
                    title: "Ajouter un prospect",
                    url: "/dashboard/prospect/add-prospect",
                },
                {
                    title: "Relances",
                    url: "/dashboard/prospect/relances",
                },
            ],
        },
        {
            title: "Emails",
            url: "/emails",
            icon: Mail,
            items: [
                {
                    title: "Templates",
                    url: "/emails/templates",
                },
                {
                    title: "Historique",
                    url: "/emails/historique",
                },
            ],
        },
        {
            title: "Calendrier",
            url: "/calendar",
            icon: Calendar,
            items: [
                {
                    title: "Planning",
                    url: "/calendar",
                },
                {
                    title: "Relances prévues",
                    url: "/calendar/relances",
                },
            ],
        },
        {
            title: "Paramètres",
            url: "/settings",
            icon: Settings2,
            items: [
                {
                    title: "Général",
                    url: "/settings",
                },
                {
                    title: "Email",
                    url: "/settings/email",
                },
                {
                    title: "Compte",
                    url: "/settings/account",
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
            url: "/dashboard?filter=relance",
            icon: Calendar,
        },
    ],
    breadcrumbs: {
        '/dashboard': 'Liste des prospects',
        '/dashboard/prospect/list-prospects': 'Liste des prospects',
        '/dashboard/prospect/add-prospect': 'Ajouter un prospect',
        '/dashboard/prospect/relances': 'Relances',
        '/emails/templates': 'Templates d\'emails',
        '/emails/historique': 'Historique des emails',
        '/calendar': 'Planning',
        '/calendar/relances': 'Relances prévues',
        '/settings': 'Paramètres généraux',
        '/settings/email': 'Paramètres email',
        '/settings/account': 'Paramètres du compte',
    }
}