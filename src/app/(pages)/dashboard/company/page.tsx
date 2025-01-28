import { getCompany } from "@actions/companies/company.action";
import { CompanyForm } from "./components/company-form";
import { CompanyView } from "./components/company-view";

export default async function CompanyPage() {
    const { data: company, failure } = await getCompany();

    return (
        <div className="container max-w-7xl mx-auto p-4">
            {company ? (
                <CompanyView company={company} />
            ) : (
                <CompanyForm />
            )}
        </div>
    );
} 