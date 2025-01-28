'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mail, Globe, Calendar, Clock, User } from 'lucide-react';
import { ProspectWithId } from '@/lib/schemas/prospect-schema';


export function FollowUpList({ prospects }: { prospects: ProspectWithId[] }) {
    const router = useRouter();

    const handleResend = (prospect: ProspectWithId) => {
        if (prospect.lastEmail) {
            router.push(`/dashboard/prospect/send-email/${prospect.id}?resend=true`);
        } else {
            router.push(`/dashboard/prospect/send-email/${prospect.id}`);
        }
    };

    const formatDateRelative = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true, locale: fr });
        } catch (error) {
            return 'Date invalide';
        }
    };

    const formatDateAbsolute = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
        } catch (error) {
            return 'Date invalide';
        }
    };

    if (prospects.length === 0) {
        return (
            <Card className="p-6 text-center bg-gradient-glass backdrop-blur-glass">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-500">
                    Aucun prospect à relancer pour le moment
                </p>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {prospects.map((prospect) => (
                <Card key={prospect.id} className="p-6 bg-gradient-glass backdrop-blur-glass hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        {/* Informations principales */}
                        <div className="space-y-4 flex-grow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{prospect.contact}</h3>
                                    <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
                                        <a href={prospect.site} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:text-primary transition-colors">
                                            <Globe className="w-4 h-4" />
                                            {prospect.site}
                                        </a>
                                        <a href={`mailto:${prospect.email}`}
                                            className="flex items-center gap-2 hover:text-primary transition-colors">
                                            <Mail className="w-4 h-4" />
                                            {prospect.email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Informations sur le dernier email */}
                            {prospect.lastEmail && (
                                <div className="ml-[3.25rem] space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-primary/70" />
                                        <span>
                                            Dernier email : {formatDateRelative(prospect.lastEmail.created_at)}
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({formatDateAbsolute(prospect.lastEmail.created_at)})
                                            </span>
                                        </span>
                                    </div>
                                    {prospect.lastEmail.subject && (
                                        <p className="text-gray-500 italic ml-6">
                                            Objet : {prospect.lastEmail.subject}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Date de relance */}
                            <div className="ml-[3.25rem] flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-primary/70" />
                                <div>
                                    <span className="text-gray-600">
                                        Relance prévue : {formatDateRelative(prospect.dateRelanceOptimale)}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({formatDateAbsolute(prospect.dateRelanceOptimale)})
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bouton de relance */}
                        <div className="md:self-start">
                            <Button
                                onClick={() => handleResend(prospect)}
                                className="w-full md:w-auto"
                            >
                                <Mail className="w-4 h-4" />
                                Relancer
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
} 