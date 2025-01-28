"use client"

import { createLinkedinPost } from '@actions/linkedin/post-linkedin.action';
import { FileText } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { usePostContent } from '@dashboard/linkedin/hooks/use-post-content';
import { FormField } from './form-field';
import { FORM_FIELDS } from '@/data/linkedin-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GenerateLinkedinPostSchema } from '@/lib/schemas/linkedin.schema';
import { z } from 'zod';

type FormData = z.infer<typeof GenerateLinkedinPostSchema>;

export const PostLinkedinForm = () => {
    const { setContent } = usePostContent();
    const { execute, result, hasErrored, hasSucceeded, isExecuting } = useAction(createLinkedinPost);

    const form = useForm<FormData>({
        resolver: zodResolver(GenerateLinkedinPostSchema),
        defaultValues: {
            objective: '',
            targetAudience: '',
            topic: '',
            tone: '',
            keywords: '',
            callToAction: '',
            additionalContext: ''
        }
    });

    useEffect(() => {
        if (result?.data?.post) {
            setContent(result.data.post);
        }
    }, [result, setContent]);

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        execute(formData);
    };

    return (
        <Card className="bg-gradient-glass backdrop-blur-glass border-white/10 shadow-glass">
            <CardHeader className="border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-medium text-text-primary">
                        Nouveau post LinkedIn
                    </h1>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {FORM_FIELDS.leftColumn.map(field => (
                                    <FormField
                                        key={field.id}
                                        field={field}
                                        form={form}
                                    />
                                ))}
                            </div>
                            <div className="space-y-4">
                                {FORM_FIELDS.rightColumn.map(field => (
                                    <FormField
                                        key={field.id}
                                        field={field}
                                        form={form}
                                    />
                                ))}
                            </div>
                        </div>

                        {hasSucceeded && (
                            <Alert>
                                <AlertDescription>{result?.data?.message}</AlertDescription>
                            </Alert>
                        )}

                        {hasErrored && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {result?.serverError || result?.validationErrors?._errors?.[0] || "Erreur inconnue"}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isExecuting}
                        >
                            {isExecuting ? "Génération en cours..." : "Générer le post"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};