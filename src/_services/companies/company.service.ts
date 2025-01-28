import { Company } from "@/lib/schemas/companies/company.schema";
import { AuthService } from "@/app/_services/auth/auth.service";
import { Timestamp } from "firebase-admin/firestore";

export class CompanyService {
    constructor(
        private readonly db: FirebaseFirestore.Firestore,
        private readonly authService: AuthService,
    ) {
        if (!db) throw new Error("Database connection required");
    }

    async createCompany(company: Company) {
        const user = await this.authService.checkAuth();
        const companyData = {
            ...company,
            members: [user.id],
            createdBy: user.id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        const docRef = await this.db
            .collection('companies')
            .add(companyData);

        await this.db
            .collection('users')
            .doc(user.id)
            .update({
                companyId: docRef.id,
                role: 'ADMIN'
            });
        return docRef.id;
    }

    async getCompany() {
        const user = await this.authService.checkAuth();
        
        // Récupérer l'ID de l'entreprise de l'utilisateur
        const userDoc = await this.db
            .collection('users')
            .doc(user.id)
            .get();
        
        const userData = userDoc.data();
        if (!userData?.companyId) {
            throw new Error("Aucune entreprise associée");
        }

        // Récupérer les données de l'entreprise
        const companyDoc = await this.db
            .collection('companies')
            .doc(userData.companyId)
            .get();

        if (!companyDoc.exists) {
            throw new Error("Entreprise non trouvée");
        }

        return {
            id: companyDoc.id,
            ...companyDoc.data()
        };
    }
}