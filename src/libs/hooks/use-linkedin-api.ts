'use client';

import { axiosInstance } from '@/libs/configs/axios.config';
import { useState } from 'react';
import useCurrentUser from '@/libs/hooks/use-current-user';


export const useLinkedInApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useCurrentUser();

    const publishPost = async (content: string) => {
        if (!user?.accessToken || !user?.id) {
            setError('Non authentifié');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/post_linkedin', {
                content,
                accessToken: user.accessToken as string,
                userId: user.id,
            });
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        publishPost,
        isLoading,
        error,
    };
}; 