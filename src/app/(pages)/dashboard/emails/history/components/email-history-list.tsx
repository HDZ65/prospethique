'use client';

import { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Mail, Search, Calendar, ArrowUp, ArrowDown, Trash2, Eye } from 'lucide-react';
import { cn } from "@/lib/utils/core/cn";
import { CompleteSendEmail } from '@/lib/schemas/email-template-schema';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { deleteEmail } from '@/_actions/prospects/email.action';
import { ConfirmModal } from '@/components/confirm-modal';
import { useAction } from 'next-safe-action/hooks';
import toast from 'react-hot-toast';

interface EmailHistoryProps {
    initialEmails?: CompleteSendEmail[];
}

type SortOption = {
    value: keyof CompleteSendEmail;
    label: string;
    transform?: (a: any, b: any) => number;
};

const sortOptions: SortOption[] = [
    {
        value: 'created_at',
        label: 'Date d\'envoi',
        transform: (a, b) => new Date(b).getTime() - new Date(a).getTime()
    },
    {
        value: 'last_event',
        label: 'Statut',
        transform: (a, b) => a.localeCompare(b)
    },
    {
        value: 'site',
        label: 'Site web',
        transform: (a, b) => a.localeCompare(b)
    },
    {
        value: 'contact',
        label: 'Contact',
        transform: (a, b) => a.localeCompare(b)
    }
];

const statusStyles: Record<string, { className: string }> = {
    'E-mail envoyé': { className: "bg-yellow-500/10 text-yellow-400" },
    'E-mail délivré': { className: "bg-green-500/10 text-green-400" },
    'E-mail délivré avec retard': { className: "bg-orange-500/10 text-orange-400" },
    'E-mail signalé comme spam': { className: "bg-red-500/10 text-red-400" },
    'E-mail rejeté': { className: "bg-red-500/10 text-red-400" },
};

export function EmailHistoryList({ initialEmails = [] }: EmailHistoryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<keyof CompleteSendEmail>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [emails, setEmails] = useState(initialEmails);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState<CompleteSendEmail | null>(null);

    const { execute: deleteEmailAction } = useAction(deleteEmail, {
        onSuccess: () => {
            toast.success("Email supprimé avec succès");
        },
        onError: (error) => {
            console.log('error', error);
            toast.error(error.error?.serverError || "Erreur lors de la suppression");
        }
    });

    const sortedEmails = [...emails].sort((a, b) => {
        const sortOption = sortOptions.find(option => option.value === sortBy);
        if (!sortOption?.transform) return 0;

        const result = sortOption.transform(a[sortBy], b[sortBy]);
        return sortOrder === 'asc' ? result : -result;
    }).filter(email =>
        email.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.last_event.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDeleteClick = (email: CompleteSendEmail) => {
        setEmailToDelete(email);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (emailToDelete) {
            handleDelete(emailToDelete.id);
            setIsDeleteModalOpen(false);
            setEmailToDelete(null);
        }
    };

    const handleDelete = useCallback((id: string) => {
        const formData = new FormData();
        formData.append('id', id);
        deleteEmailAction(formData);
        // Mise à jour optimiste
        setEmails(currentEmails =>
            currentEmails.filter(email => email.id !== id)
        );
    }, [deleteEmailAction]);

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
                                <Mail className="w-5 h-5 text-primary" />
                            </motion.div>
                            <h1 className="text-2xl font-medium text-text-primary">
                                Historique des emails
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                onValueChange={(value) => {
                                    const [field, order] = value.split('-');
                                    setSortBy(field as keyof CompleteSendEmail);
                                    setSortOrder(order as 'asc' | 'desc');
                                }}
                                defaultValue={`${sortBy}-${sortOrder}`}
                            >
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.flatMap(option => {
                                        if (option.value === 'created_at') {
                                            return [
                                                <SelectItem key={`${option.value}-desc`} value={`${option.value}-desc`}>
                                                    {option.label} (Plus récent)
                                                </SelectItem>,
                                                <SelectItem key={`${option.value}-asc`} value={`${option.value}-asc`}>
                                                    {option.label} (Plus ancien)
                                                </SelectItem>
                                            ];
                                        }
                                        return [
                                            <SelectItem key={`${option.value}-asc`} value={`${option.value}-asc`}>
                                                {option.label} (A à Z)
                                            </SelectItem>,
                                            <SelectItem key={`${option.value}-desc`} value={`${option.value}-desc`}>
                                                {option.label} (Z à A)
                                            </SelectItem>
                                        ];
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-4 h-4" />
                        <Input
                            type="search"
                            placeholder="Rechercher un email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-muted/60 border-white/10 shadow-input placeholder:text-text-tertiary focus:border-primary/30 hover:border-white/20"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0 divide-y divide-white/10">
                    {sortedEmails?.map((email, index) => (
                        <motion.div
                            key={email.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="p-4 flex justify-between hover:bg-muted/60 transition-colors duration-150"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-text-primary font-medium">
                                            {email.site}
                                        </h3>
                                        <Badge
                                            className={cn(
                                                "font-medium",
                                                statusStyles[email.last_event]?.className
                                            )}
                                        >
                                            {email.last_event}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{email.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Envoyé le {formatDate(email.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="text-text-secondary hover:text-text-primary"
                                >
                                    <Link href={`/dashboard/emails/${email.id}`}>
                                        <Eye className="w-4 h-4" />
                                        <span className="hidden sm:inline">Voir le détail</span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(email)}
                                    className="text-text-secondary hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Supprimer</span>
                                </Button>
                            </div>
                        </motion.div>
                    ))}

                    {sortedEmails?.length === 0 && (
                        <div className="p-8 text-center text-text-secondary">
                            Aucun email trouvé
                        </div>
                    )}
                </CardContent>
            </Card>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleConfirmDelete()}
                title="Confirmer la suppression"
                description={`Êtes-vous sûr de vouloir supprimer le prospect ${emailToDelete?.site || ''} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                confirmVariant="destructive"
                className="bg-background"
            >
                <div className="flex items-center space-x-2 mt-4">
                    <label htmlFor="deleteEmails">
                        Supprimer également les emails envoyés
                    </label>
                </div>
            </ConfirmModal>
        </>
    );
} 