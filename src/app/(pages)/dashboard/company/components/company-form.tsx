'use client';

import { createCompany } from "@actions/companies/company.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export function CompanyForm() {
    const { register, handleSubmit } = useForm();

    const { execute } = useAction(createCompany, {
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.error || "Une erreur est survenue");
        }
    });

    const onSubmit = (data: any) => {
        execute({ parsedInput: data });
    };

    return (
        <Card className="bg-gradient-glass backdrop-blur-glass border-none shadow-glass">
            <CardHeader>
                <h1 className="text-2xl font-bold">Créer votre entreprise</h1>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nom de l'entreprise
                        </label>
                        <Input
                            {...register("name")}
                            placeholder="Nom de l'entreprise"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Site web
                        </label>
                        <Input
                            {...register("website")}
                            placeholder="https://..."
                            className="w-full"
                        />
                    </div>
                    <Button type="submit">
                        Créer l'entreprise
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 