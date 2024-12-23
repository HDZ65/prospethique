import { Calendar, Clock, Linkedin, Building2, Users } from 'lucide-react';
import { ReactNode } from 'react';

// Définition des types
interface MenuItem {
    href: string;
    label: string;
    icon?: ReactNode;
}

interface BrandingConfig {
    name: string;
    logo: {
        icon: ReactNode;
        authenticatedHref: string;
        publicHref: string;
    }
}

interface NavigationConfig {
    authenticatedMenuItems: MenuItem[];
    publicMenuItems: MenuItem[];
    branding: BrandingConfig;
}

export const navigationConfig: NavigationConfig = {
    authenticatedMenuItems: [
        {
            href: '/dashboard/calendar',
            icon: <Calendar className="w-5 h-5" />,
            label: 'Calendrier'
        },
        {
            href: '/dashboard/tasks',
            icon: <Clock className="w-5 h-5" />,
            label: 'Tâches'
        },
        {
            href: '/dashboard/linkedin',
            icon: <Linkedin className="w-5 h-5" />,
            label: 'LinkedIn'
        },
        {
            href: '/dashboard/company',
            icon: <Building2 className="w-5 h-5" />,
            label: 'Entreprise'
        },
    ],
    publicMenuItems: [
        {
            href: '/about',
            label: 'À propos'
        },
        {
            href: '/features',
            label: 'Fonctionnalités'
        },
        {
            href: '/pricing',
            label: 'Tarifs'
        },
    ],
    branding: {
        name: 'ProspEthique',
        logo: {
            icon: <Users className="h-5 w-5 text-primary" />,
            authenticatedHref: '/dashboard',
            publicHref: '/',
        }
    }
};