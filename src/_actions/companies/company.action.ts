"use server";

import { actionClient } from "@/lib/safe-action";
import { schemaCompany } from "@/lib/schemas/companies/company.schema";
import { CompanyService } from "@services/companies/company.service";
import { db } from "@/lib/firebase/firebase-admin";
import { revalidatePath } from "next/cache";
import { AuthService } from "@services/auth/auth.service";
import { formatFirebaseDates } from "@/lib/utils/date";

const authService = new AuthService();
const companyService = new CompanyService(db, authService);

export const createCompany = actionClient
    .schema(schemaCompany)
    .action(async ({ parsedInput: companyData }) => {
        try {
            const id = await companyService.createCompany(companyData);
            revalidatePath('/dashboard/company');
            return {
                message: 'Entreprise créée avec succès',
                company: {
                    ...companyData,
                    id
                }
            };
        } catch (error) {
            return {
                failure: 'Erreur lors de la création de l\'entreprise',
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    });

export const getCompany = async () => {
    try {
        const company = await companyService.getCompany();
        return {
            data: formatFirebaseDates(company),
            message: 'Entreprise récupérée avec succès'
        };
    } catch (error) {
        return {
            failure: 'Erreur lors de la récupération de l\'entreprise',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
};