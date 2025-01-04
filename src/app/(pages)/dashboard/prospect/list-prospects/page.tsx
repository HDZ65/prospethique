import { ProspectsList } from "@dashboard/prospect/list-prospects/components/prospect-list";
import { getProspects } from "@actions/prospects/prospects.action";
import { Suspense } from "react";
import { ProspectWithId } from "@/libs/schemas/prospect-schema";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <ProspectsListServer />
        </Suspense>
    );
}