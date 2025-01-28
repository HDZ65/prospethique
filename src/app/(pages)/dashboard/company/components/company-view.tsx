'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Company } from "@/lib/schemas/companies/company.schema";

interface CompanyViewProps {
    company: Company & { id: string };
}

export function CompanyView({ company }: CompanyViewProps) {
    return (
        <Card className="bg-gradient-glass backdrop-blur-glass border-none shadow-glass">
            <CardHeader>
                <h1 className="text-2xl font-bold">Votre entreprise</h1>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nom de l'entreprise
                        </label>
                        <p className="text-lg">{company.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Site web
                        </label>
                        <a 
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {company.website}
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 