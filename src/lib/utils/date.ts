import { Timestamp } from "firebase-admin/firestore";

// Pour convertir Timestamp vers string
export const formatFirebaseDate = (timestamp: Timestamp | null | undefined): string => {
    if (!timestamp) return '';
    try {
        return timestamp.toDate().toISOString();
    } catch (error) {
        return '';
    }
};

// Pour convertir string vers Timestamp
export const toFirebaseTimestamp = (dateString: string | null | undefined): Timestamp | null => {
    if (!dateString) return null;
    try {
        return Timestamp.fromDate(new Date(dateString));
    } catch (error) {
        return null;
    }
};

// Fonction qui vérifie si une string est une date valide
const isDateString = (value: string): boolean => {
    const date = new Date(value);
    return value !== '' && !isNaN(date.getTime());
};


// Fonction qui vérifie si une valeur est un Timestamp Firebase
const isFirebaseTimestamp = (value: any): value is Timestamp => {
    return value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value;
};

// Fonction récursive qui formate automatiquement les Timestamps dans un objet
export const formatFirebaseDates = <T extends object>(obj: T): T => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        // Si c'est un Timestamp, on le formate
        if (isFirebaseTimestamp(value)) {
            return {
                ...acc,
                [key]: formatFirebaseDate(value)
            };
        }
        
        // Si c'est un objet (mais pas un Timestamp), on applique récursivement
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return {
                ...acc,
                [key]: formatFirebaseDates(value)
            };
        }
        
        // Sinon on garde la valeur telle quelle
        return {
            ...acc,
            [key]: value
        };
    }, {} as T);
}; 

// Fonction récursive qui convertit les strings de date en Timestamp
export const toFirebaseTimestamps = <T extends object>(obj: T): T => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        // Si c'est une string de date valide
        if (typeof value === 'string' && isDateString(value)) {
            return {
                ...acc,
                [key]: Timestamp.fromDate(new Date(value))
            };
        }
        
        // Si c'est un objet, on applique récursivement
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return {
                ...acc,
                [key]: toFirebaseTimestamps(value)
            };
        }
        
        // Sinon on garde la valeur telle quelle
        return {
            ...acc,
            [key]: value
        };
    }, {} as T);
};