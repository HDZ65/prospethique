'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from "next-safe-action/hooks";
import { ProspectWithId } from '@/lib/schemas/prospect-schema';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { Preview } from './preview';
import { FormField } from '@/components/form/form-field';
import { Mail } from 'lucide-react';
import { SendEmail } from '@/lib/schemas/email-template-schema';
import { sendEmail } from '@actions/prospects/email.action';

interface EmailFormProps {
    initialProspect: ProspectWithId | null;
    lastEmail: SendEmail | null;
}

interface FormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'textarea';
    placeholder: string;
}

const EMAIL_FIELDS: FormField[] = [
    { id: 'site',  label: 'Site web', type: 'url', placeholder: 'https://www.example.com' },
    { id: 'contact', label: 'Contact', type: 'text', placeholder: 'John Doe' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
    { id: 'recherche', label: 'Lors de mes recherches sur ...', type: 'text', placeholder: 'Ex: les agences web' },
    { id: 'ameliorationList', label: "Liste des améliorations à apporter :", type: 'textarea', placeholder: "Ajouter une amélioration..." },
    { id: 'motCle', label: 'Avec le mot clé ...', type: 'text', placeholder: 'Ex: agence web' },
    { id: 'numeroPage', label: 'On a trouvé votre site sur la page ...', type: 'text', placeholder: 'Ex: 6' },
];

export function EmailTemplate({ initialProspect, lastEmail }: EmailFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<SendEmail>({
        prospectId: initialProspect?.id || '',
        site: initialProspect?.site || '',
        contact: initialProspect?.contact || '',
        email: initialProspect?.email || '',
        ameliorationList: lastEmail?.ameliorationList || '',
        motCle: lastEmail?.motCle || '',
        numeroPage: lastEmail?.numeroPage || '',
        recherche: lastEmail?.recherche || ''
    });

    const { execute, status: sendStatus, result } = useAction(sendEmail, {
        onSuccess: () => {
            toast.success("Email envoyé avec succès");
            router.push('/dashboard');
        },
        onError: (error) => {
            console.log("error", error);
            toast.error(error.error?.serverError || "Erreur lors de l'envoi");
        }
    });

    const handleFieldChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSubmit.append(key, value || '');
        });
        execute(formDataToSubmit);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Card className="bg-gradient-glass backdrop-blur-glass shadow-glass border-none">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 rounded-lg bg-muted/60 border border-white/5">
                            <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                        </span>
                        <h1 className="text-2xl font-medium text-text-primary">Envoyer un email</h1>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <form onSubmit={handleSendEmail} className="space-y-5" noValidate>
                                {EMAIL_FIELDS.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <FormField
                                            {...field}
                                            name={field.id}
                                            value={formData[field.id as keyof typeof formData]}
                                            disabled={sendStatus === 'executing'}
                                            onChange={(value) => handleFieldChange(field.id, value)}
                                            error={result?.validationErrors?.[field.id as keyof typeof formData]?._errors}
                                        />
                                        {result?.validationErrors?.[field.id as keyof typeof formData]?._errors && (
                                            <p className="text-red-500 text-sm">
                                                {result?.validationErrors?.[field.id as keyof typeof formData]?._errors?.[0] || ''}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={sendStatus === 'executing'}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={sendStatus === 'executing'}
                                    >
                                        {sendStatus === 'executing' ? 'Envoi...' : 'Envoyer'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="hidden lg:block h-[calc(100vh-300px)] overflow-y-auto">
                            <Preview {...formData} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}