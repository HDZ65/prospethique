'use client'

import { ProspectsList } from "@dashboard/prospect/list-prospects/components/prospect-list";
import { useAction } from "next-safe-action/hooks";
import { addProspect, getProspects, deleteProspect } from "@actions/prospects/prospects.action";
import { useCallback, useEffect, useState } from "react";
import { ProspectWithId } from "@/libs/schemas/prospect-schema";
import { toast } from "react-hot-toast";


export default function DashboardPage() {
    const { execute, status } = useAction(getProspects, {
        onSuccess: (data) => {
            setProspects(data.data as ProspectWithId[]);
        },
        onError: (error) => {
            toast.error(error.error?.serverError || "Erreur lors de la récupération des prospects");
        }
    });
    const { execute: deleteProspectAction } = useAction(deleteProspect, {
        onSuccess: () => {
            toast.success("Prospect supprimé avec succès");
        },
        onError: (error) => {
            toast.error(error.error?.serverError || "Erreur lors de la suppression");
        }
    });
    const [prospects, setProspects] = useState<ProspectWithId[]>([]);

    // Chargement initial des prospects
    useEffect(() => {
        execute();
    }, [execute]);

    // Gestion de la suppression
    const handleDelete = useCallback((id: string) => {
        const formData = new FormData();
        formData.append('id', id);
        deleteProspectAction(formData);
        // Mise à jour optimiste
        setProspects(currentProspects =>
            currentProspects.filter(prospect => prospect.id !== id)
        );
    }, [deleteProspectAction]);

    return (
        <ProspectsList
            prospects={prospects}
            onDelete={handleDelete}
            status={status}
        />
    );
}