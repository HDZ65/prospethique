'use client'
import { ProspectsList } from "@/components/ProspectsList";
import { useAction } from "next-safe-action/hooks";
import { addProspect, getProspects } from "@/app/actions/prospects-action";
import { useCallback, useEffect, useState } from "react";
import { AddProspectForm } from "@/components/AddProspectForm";
import { deleteProspect } from "@/app/actions/prospects-action";
import { ProspectWithId } from "@/schemas/prospect-schema";
import { AddProspectActionResult } from '@/app/actions/prospects-action';

export default function Page() {

  const { execute, result, status } = useAction(getProspects);
  const { execute: addProspectAction, result: addProspectResult, isExecuting: isAddingProspect, hasSucceeded: hasAddedProspect, hasErrored: hasErroredAddingProspect } = useAction(addProspect);
  const { execute: deleteProspectAction } = useAction(deleteProspect);

  const [prospects, setProspects] = useState<ProspectWithId[]>([]);

  // Chargement initial des prospects
  useEffect(() => {
    execute();
  }, [execute]);

  // Mise à jour des prospects depuis le résultat de getProspects
  useEffect(() => {
    if (result?.data?.prospects) {
      setProspects(result.data.prospects);
    }
  }, [result?.data?.prospects]);

  // Gestion de la suppression
  const handleDelete = useCallback((id: string) => {
    const formData = new FormData();
    formData.append('id', id);
    deleteProspectAction(formData);
    setProspects(currentProspects =>
      currentProspects.filter(prospect => prospect.id !== id)
    );
  }, [deleteProspectAction]);
  
  // Mise à jour après ajout réussi
  useEffect(() => {
    if (addProspectResult.data?.prospect) {
      setProspects(currentProspects =>
        [addProspectResult.data?.prospect as ProspectWithId, ...currentProspects]
      );
    }
  }, [addProspectResult?.data?.prospect]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex gap-6">
      <ProspectsList prospects={prospects} onDelete={handleDelete} status={status} />
      <AddProspectForm execute={addProspectAction} result={addProspectResult as AddProspectActionResult} isExecuting={isAddingProspect} hasSucceeded={hasAddedProspect} hasErrored={hasErroredAddingProspect} />
    </div>
  );
}
