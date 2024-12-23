"use server";

import { actionClient } from "@/libs/safe-action";
import { schemaCompany } from "@/libs/schemas/companies/company.schema";
import { CompanyService } from "@services/companies/company.service";
import { db } from "@/libs/firebase/firebase-admin";
import { revalidatePath } from "next/cache";
import { AuthService } from "@services/auth/auth.service";

const authService = new AuthService();
const companyService = new CompanyService(db, authService);

export const createCompany = actionClient
    .schema(schemaCompany)
    .action(async ({ parsedInput: companyData }) => {
        try {
            const id = await companyService.createCompany(companyData);
            revalidatePath('/company');
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