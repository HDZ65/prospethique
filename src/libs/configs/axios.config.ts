import axios from 'axios';
// Instance de base
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
    (config) => {
        // Vous pouvez ajouter des headers communs ici
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Gérer les erreurs d'authentification
            console.error('Session expirée ou non authentifiée');
        }
        return Promise.reject(error);
    }
);