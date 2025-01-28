'use client'

import { useAction } from "next-safe-action/hooks";
import { addProspect, AddProspectActionResult } from "@actions/prospects/prospects.action";
import { toast } from "react-hot-toast";
import { AddProspectForm } from "./components/add-prospect-form";
import { useRouter } from "next/navigation";

export default function AddProspectPage() {
    const router = useRouter();
    const { execute: addProspectAction, result: addProspectResult, isExecuting: isAddingProspect } = useAction(addProspect, {
        onSuccess: (data) => {
            toast.success(data.data?.message || "Prospect ajouté avec succès, redirigement vers la liste des prospects...");
            router.push('/dashboard');
        },
        onError: (error) => {
            console.log("error", error);
            toast.error(error.error?.serverError || "Erreur lors de l'ajout du prospect");
        }
    });
    return (
        <AddProspectForm
            execute={addProspectAction}
            result={addProspectResult as AddProspectActionResult}
            isExecuting={isAddingProspect}
        />
    );
}