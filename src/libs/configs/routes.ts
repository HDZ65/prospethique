/**
 * Configuration des routes de l'application
 * @description Définit les routes publiques, d'authentification et les redirections par défaut
 */

export const publicRoutes = [
    '/about',
    '/features',
    '/pricing',
    '/privacy',
    '/terms'
];

export const authRoutes = [
    '/auth/sign-in',
    '/auth/signup',
    '/auth/error',
    '/auth/reset-password',
    '/auth/new-password',
];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
export const DEFAULT_LOGGED_IN_REDIRECT = '/dashboard';
