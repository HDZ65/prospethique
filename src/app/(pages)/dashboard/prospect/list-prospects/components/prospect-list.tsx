'use client';

import { useAction } from "next-safe-action/hooks";
import { deleteProspect } from "@actions/prospects/prospects.action";
import { useCallback, useState, Suspense } from "react";
import { ProspectWithId } from "@/lib/schemas/prospect-schema";
import { toast } from "react-hot-toast";
import { motion } from 'framer-motion';
import { Users, Mail, Calendar, Search, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { EmailFormModal } from '@/app/(pages)/dashboard/prospect/_components/email-form-modal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils/core/cn";
import { ConfirmModal } from '@/components/confirm-modal';
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox";

interface ProspectsListProps {
    initialProspects: ProspectWithId[];
}

const statusStyles: Record<string, { variant: BadgeProps["variant"], className: string }> = {
    'À contacter': { variant: "warning", className: "bg-yellow-500/10 text-yellow-400" },
};

const EditButton = ({ prospectId }: { prospectId: string }) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-text-secondary hover:text-text-primary"
        >
            <Link href={`/dashboard/prospect/update-prospect/${prospectId}`}>
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
            </Link>
        </Button>
    );
};

export const ProspectsList = ({ initialProspects }: ProspectsListProps) => {
    const router = useRouter();
    const [prospects, setProspects] = useState<ProspectWithId[]>(initialProspects);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedProspect, setSelectedProspect] = useState<ProspectWithId | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [prospectToDelete, setProspectToDelete] = useState<ProspectWithId | null>(null);
    const [deleteWithEmails, setDeleteWithEmails] = useState(false);


    const { execute: deleteProspectAction } = useAction(deleteProspect, {
        onSuccess: () => {
            toast.success("Prospect supprimé avec succès");
        },
        onError: (error) => {
            console.log('error', error);
            toast.error(error.error?.serverError || "Erreur lors de la suppression");
        }
    });

    const handleDelete = useCallback((id: string, deleteWithEmails: boolean) => {
        const formData = new FormData();
        formData.append('id', id);
        if (deleteWithEmails) {
            formData.append('deleteEmails', 'on');
        }
        deleteProspectAction(formData);
        // Mise à jour optimiste
        setProspects(currentProspects =>
            currentProspects.filter(prospect => prospect.id !== id)
        );
    }, [deleteProspectAction]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDeleteClick = (prospect: ProspectWithId) => {
        setProspectToDelete(prospect);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = (deleteWithEmails: boolean) => {
        if (prospectToDelete) {
            handleDelete(prospectToDelete.id, deleteWithEmails);
            setIsDeleteModalOpen(false);
            setProspectToDelete(null);
        }
    };

    const handleEmailClick = (prospect: ProspectWithId) => {
        router.push(`/dashboard/prospect/send-email/${prospect.id}`);
    };


    return (
        <>
            <Card className="bg-gradient-glass backdrop-blur-glass border-none shadow-glass">
                <CardHeader className="border-b border-white/10 space-y-6 px-4">
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="p-2 rounded-lg bg-muted/60 border border-white/5"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Users className="w-5 h-5 text-primary" />
                                </motion.div>
                                <h1 className="text-2xl font-medium text-text-primary">
                                    Liste des prospects
                                </h1>
                            </div>
                            <Button asChild>
                                <Link href="/dashboard/prospect/add-prospect">
                                    Nouveau prospect
                                </Link>
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-4 h-4" />
                            <Input
                                type="search"
                                placeholder="Rechercher un prospect..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-muted/60 border-white/10 shadow-input placeholder:text-text-tertiary focus:border-primary/30 hover:border-white/20"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="divide-y divide-white/10">
                        {prospects.map((prospect, index) => (
                            <motion.div
                                key={prospect.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="p-4 hover:bg-muted/60 transition-colors duration-150"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-text-primary font-medium truncate">
                                                {prospect.site}
                                            </h3>
                                            {prospect.statut === 'À contacter' && (
                                                <Badge
                                                    variant={statusStyles[prospect.statut]?.variant || "secondary"}
                                                    className={cn("font-medium", statusStyles[prospect.statut]?.className)}
                                                >
                                                    {prospect.statut}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                <span className="truncate">{prospect.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Créé le {formatDate(prospect.dateCreation)}</span>
                                            </div>
                                            {prospect.dateRelanceOptimale && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span>Relance le {formatDate(prospect.dateRelanceOptimale)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Suspense
                                            fallback={
                                                <Button variant="ghost" size="sm" disabled>
                                                    <span className="animate-spin">⏳</span>
                                                    Chargement...
                                                </Button>
                                            }
                                        >
                                            <EditButton prospectId={prospect.id} />
                                        </Suspense>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEmailClick(prospect)}
                                            className="text-text-secondary hover:text-text-primary"
                                        >
                                            <Mail className="w-4 h-4" />
                                            <span className="hidden sm:inline">Email</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteClick(prospect)}
                                            className="text-text-secondary hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="hidden sm:inline">Supprimer</span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {prospects.length === 0 && (
                            <div className="p-8 text-center text-text-secondary">
                                Aucun prospect trouvé
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <EmailFormModal
                isOpen={isEmailModalOpen}
                onClose={() => {
                    setIsEmailModalOpen(false);
                    setSelectedProspect(null);
                }}
                prospect={selectedProspect as ProspectWithId}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleConfirmDelete(deleteWithEmails)}
                title="Confirmer la suppression"
                description={`Êtes-vous sûr de vouloir supprimer le prospect ${prospectToDelete?.site || ''} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                confirmVariant="destructive"
                className="bg-background"
            >
                <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                        id="deleteEmails"
                        checked={deleteWithEmails}
                        onCheckedChange={(checked: boolean) => setDeleteWithEmails(checked)}
                    />
                    <label htmlFor="deleteEmails">
                        Supprimer également les emails envoyés
                    </label>
                </div>
            </ConfirmModal>
        </>
    );
};