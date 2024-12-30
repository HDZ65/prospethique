'use client'

import { useAction } from "next-safe-action/hooks";
import { addProspect, AddProspectActionResult } from "@actions/prospects/prospects.action";
import { toast } from "react-hot-toast";
import { AddProspectForm } from "./components/add-prospect-form";
import { redirect } from "next/navigation";


export default function AddProspectPage() {
    const { execute: addProspectAction, result: addProspectResult, isExecuting: isAddingProspect } = useAction(addProspect, {
        onSuccess: (data) => {
            toast.success(data.data?.message || "Prospect ajouté avec succès, redirigement vers la liste des prospects...");
            setTimeout(() => {
                redirect("/dashboard/prospect/list-prospects");
            }, 1000);
        },
        onError: (error) => {
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