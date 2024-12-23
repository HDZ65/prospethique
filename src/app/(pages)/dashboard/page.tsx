'use client'

import { ProspectsList } from "@dashboard/prospect/components/prospect-list";
import { useAction } from "next-safe-action/hooks";
import { addProspect, getProspects, deleteProspect } from "@actions/prospects/prospects.action";
import { useCallback, useEffect, useState } from "react";
import { AddProspectForm } from "@dashboard/prospect/components/add-prospect-form";
import { ProspectWithId } from "@/libs/schemas/prospect-schema";
import { AddProspectActionResult } from '@actions/prospects/prospects.action';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
    const { execute, result, status } = useAction(getProspects);
    const {
        execute: addProspectAction,
        result: addProspectResult,
        isExecuting: isAddingProspect,
        hasSucceeded: hasAddedProspect,
        hasErrored: hasErroredAddingProspect
    } = useAction(addProspect);
    const { execute: deleteProspectAction } = useAction(deleteProspect);
    const [prospects, setProspects] = useState<ProspectWithId[]>([]);

    // Chargement initial des prospects
    useEffect(() => {
        execute();
    }, [execute]);

    // Mise à jour des prospects depuis le résultat de getProspects
    useEffect(() => {
        if (result?.data && Array.isArray(result.data)) {
            setProspects(result.data as ProspectWithId[]);
        }
    }, [result?.data]);

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
        <div className="container space-y-4 py-8 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <Tabs defaultValue="prospects" className="space-y-8">
                <TabsList>
                    <TabsTrigger value="prospects">Prospects</TabsTrigger>
                    <TabsTrigger value="add">Ajouter un prospect</TabsTrigger>
                </TabsList>

                <TabsContent value="prospects" className="space-y-4">

                    {status === "executing" ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <ProspectsList
                            prospects={prospects}
                            onDelete={handleDelete}
                            status={status}
                        />
                    )}

                </TabsContent>

                <TabsContent value="add">
                    <AddProspectForm
                        execute={addProspectAction}
                        result={addProspectResult as AddProspectActionResult}
                        isExecuting={isAddingProspect}
                        hasSucceeded={hasAddedProspect}
                        hasErrored={hasErroredAddingProspect}
                    />
                </TabsContent>
            </Tabs>

            {hasErroredAddingProspect && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Une erreur est survenue lors de l'opération
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}