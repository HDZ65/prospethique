import { Company } from "@/libs/schemas/companies/company.schema";
import { AuthService } from "@/app/_services/auth/auth.service";
export class CompanyService {
    constructor(
        private readonly db: FirebaseFirestore.Firestore,
        private readonly authService: AuthService,
    ) {
        if (!db) throw new Error("Database connection required");
    }

    /**
    * Crée une nouvelle entreprise
    */
    async createCompany(company: Company) {
        const user = await this.authService.checkAuth();
        const companyData = {
            ...company,
            members: [user.id],
            createdBy: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const docRef = await this.db
            .collection('companies')
            .add(companyData);

        // Mise à jour de l'utilisateur avec l'ID de l'entreprise
        await this.db
            .collection('users')
            .doc(user.id)
            .update({
                companyId: docRef.id,
                role: 'ADMIN'
            });
        return docRef.id;
    }
}