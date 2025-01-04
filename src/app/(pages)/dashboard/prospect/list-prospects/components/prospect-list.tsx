'use client';

import { useAction } from "next-safe-action/hooks";
import { deleteProspect } from "@actions/prospects/prospects.action";
import { useCallback, useState } from "react";
import { ProspectWithId } from "@/libs/schemas/prospect-schema";
import { toast } from "react-hot-toast";
import { motion } from 'framer-motion';
import { Users, Mail, Calendar, Search, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { EmailFormModal } from '@/app/(pages)/dashboard/prospect/_components/email-form-modal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Badge,
    BadgeProps,
} from "@/components/ui/badge";
import { cn } from "@/libs/utils/core/cn";
import { ConfirmModal } from '@/components/confirm-modal';

interface ProspectsListProps {
    initialProspects: ProspectWithId[];
}

const statusStyles: Record<string, { variant: BadgeProps["variant"], className: string }> = {
    'Email envoyé': { variant: "secondary", className: "bg-blue-500/10 text-blue-400" },
    'À contacter': { variant: "warning", className: "bg-yellow-500/10 text-yellow-400" },
    'Refusé': { variant: "destructive", className: "bg-red-500/10 text-red-400" },
    'Accepté': { variant: "success", className: "bg-green-500/10 text-green-400" },
};

export const ProspectsList = ({ initialProspects }: ProspectsListProps) => {
    const [prospects, setProspects] = useState<ProspectWithId[]>(initialProspects);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedProspect, setSelectedProspect] = useState<ProspectWithId | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [prospectToDelete, setProspectToDelete] = useState<ProspectWithId | null>(null);


    const { execute: deleteProspectAction } = useAction(deleteProspect, {
        onSuccess: () => {
            toast.success("Prospect supprimé avec succès");
        },
        onError: (error) => {
            toast.error(error.error?.serverError || "Erreur lors de la suppression");
        }
    });

    const handleDelete = useCallback((id: string) => {
        const formData = new FormData();
        formData.append('id', id);
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

    const handleOpenEmailModal = (prospect: ProspectWithId) => {
        setSelectedProspect(prospect);
        setIsEmailModalOpen(true);
    };

    const handleDeleteClick = (prospect: ProspectWithId) => {
        setProspectToDelete(prospect);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (prospectToDelete) {
            handleDelete(prospectToDelete.id);
            setIsDeleteModalOpen(false);
            setProspectToDelete(null);
        }
    };

    return (
        <>
            <Card className="bg-gradient-glass backdrop-blur-glass border-none shadow-glass">
                <CardHeader className="border-b border-white/10 space-y-6 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="p-2 rounded-lg bg-muted/60 border border-white/5"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Users className="w-5 h-5 text-primary" />
                            </motion.div>
                            <h2 className="text-xl font-medium text-text-primary">
                                Liste des prospects
                            </h2>
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
                                            <Badge
                                                variant={statusStyles[prospect.statut]?.variant || "secondary"}
                                                className={cn("font-medium", statusStyles[prospect.statut]?.className || "bg-gray-500/10 text-gray-400")}
                                            >
                                                {prospect.statut}
                                            </Badge>
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
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>Relance le {formatDate(prospect.dateRelanceOptimale)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="text-text-secondary hover:text-text-primary"
                                        >
                                            <Link href={`/dashboard/prospect/update-prospect/${prospect.id}`}>
                                                <Pencil className="w-4 h-4 mr-2" />
                                                <span className="hidden sm:inline">Modifier</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenEmailModal(prospect)}
                                            className="text-text-secondary hover:text-text-primary"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            <span className="hidden sm:inline">Email</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteClick(prospect)}
                                            className="text-text-secondary hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
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
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                description={`Êtes-vous sûr de vouloir supprimer le prospect ${prospectToDelete?.site || ''} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                confirmVariant="destructive"
            />
        </>
    );
};