'use client';

import { useState } from 'react';
import { ProspectWithId } from '@/libs/schemas/prospect-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const emailFormSchema = z.object({
    subject: z.string().min(1, "Le sujet est requis"),
    message: z.string().min(1, "Le message est requis"),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

interface EmailFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    prospect: ProspectWithId;
}

export const EmailFormModal = ({ isOpen, onClose, prospect }: EmailFormModalProps) => {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<EmailFormData>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            subject: '',
            message: '',
        },
    });

    const onSubmit = async (data: EmailFormData) => {
        setIsSending(true);
        setError(null);
        try {
            // Ici, implémentez votre logique d'envoi d'email
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
            setSuccess(true);
            setTimeout(() => {
                onClose();
                form.reset();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError("Erreur lors de l'envoi de l'email");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Envoyer un email</DialogTitle>
                    <DialogDescription>
                        Envoyez un email à {prospect?.email}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sujet</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sujet de l'email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Votre message..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert>
                                <AlertDescription>Email envoyé avec succès!</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose} type="button">
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSending}>
                                {isSending ? "Envoi en cours..." : "Envoyer"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}; 