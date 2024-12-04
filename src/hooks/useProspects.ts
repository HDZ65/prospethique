'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProspect, updateProspectStatus, getProspects } from '@/app/actions/prospects-action';
import type { Prospect } from '@/schemas';
import type { WithId } from '@/types';

export function useProspects() {
  const router = useRouter();
  const [prospects, setProspects] = useState<Array<Prospect & WithId>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<(Prospect & WithId) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // Charger les prospects
  const loadProspects = async () => {
    try {
      setIsLoading(true);
      const result = await getProspects();
      if (result.success && result.data) {
        setProspects(result.data);
      } else {
        setError(result.error ?? 'Erreur lors du chargement');
      }
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un prospect
  const handleAddProspect = async (data: Partial<Prospect>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await addProspect(data);
      
      if (result.success) {
        await loadProspects();
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        setError(result.error ?? 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut
  const handleUpdateStatus = async (
    prospectId: string, 
    newStatus: 'À contacter' | 'Email envoyé' | 'Relance' | 'Accepté' | 'Refusé'
  ) => {
    try {
      setIsLoading(true);
      const result = await updateProspectStatus(prospectId, newStatus);
      if (result.success) {
        await loadProspects();
        router.refresh();
      } else {
        setError(result.error ?? 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // État
    prospects,
    isLoading,
    error,
    selectedProspect,
    isAddModalOpen,
    isReminderModalOpen,

    // Actions
    setSelectedProspect,
    setIsAddModalOpen,
    setIsReminderModalOpen,
    handleAddProspect,
    handleUpdateStatus,
    loadProspects
  };
} 