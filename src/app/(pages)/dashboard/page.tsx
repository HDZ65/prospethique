import { ProspectsList } from "@dashboard/prospect/list-prospects/components/prospect-list";
import { getProspects } from "@actions/prospects/prospects.action";
import { Suspense } from "react";
import { ProspectWithId } from "@/libs/schemas/prospect-schema";
// import { ProspectsListSkeleton } from "./components/prospects-list-skeleton"; // À créer

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function ProspectsListServer() {
    const prospects = await getProspects();

    return (
        <ProspectsList initialProspects={prospects as ProspectWithId[]} />
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Chargement des prospects...</div>}>
            <ProspectsListServer />
        </Suspense>
    );
}