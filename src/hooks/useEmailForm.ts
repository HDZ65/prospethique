'use client';

import { useState } from 'react';
import { ProspectWithId } from '@/schemas/prospect-schema';

interface EmailFormData {
    ameliorationList: string[];
    recherche: string;
    motCle: string;
    numeroPage: string;
}

interface UseEmailFormReturn {
    formData: EmailFormData;
    isLoading: boolean;
    error: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: () => Promise<void>;
    handleAddAmelioration: (amelioration: string) => void;
    handleRemoveAmelioration: (index: number) => void;
}

export const useEmailForm = (
    onSuccess?: () => void,
    prospect?: ProspectWithId
): UseEmailFormReturn => {
    const [formData, setFormData] = useState<EmailFormData>({
        ameliorationList: [],
        recherche: '',
        motCle: '',
        numeroPage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!prospect) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: prospect.email,
                    contact: prospect.contact,
                    website: prospect.site,
                    ...formData
                })
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi de l\'email');

            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAmelioration = (amelioration: string) => {
        if (amelioration.trim()) {
            setFormData(prev => ({
                ...prev,
                ameliorationList: [...prev.ameliorationList, amelioration.trim()]
            }));
        }
    };

    const handleRemoveAmelioration = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ameliorationList: prev.ameliorationList.filter((_, i) => i !== index)
        }));
    };

    return { formData, isLoading, error, handleChange, handleSubmit, handleAddAmelioration, handleRemoveAmelioration };
}; 