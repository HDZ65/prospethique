import { ProspectsList } from "@dashboard/prospect/list-prospects/components/prospect-list";
import { getProspects } from "@actions/prospects/prospects.action";
import { Suspense } from "react";
import { ProspectWithId } from "@/lib/schemas/prospect-schema";
import { Progress } from "@/components/ui/progress"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function ProspectsListServer() {
    const prospects = await getProspects();

    return (
        <ProspectsList initialProspects={prospects as ProspectWithId[]} />
    );
}

export default function ProspectsListPage() {
    return (
        <Suspense fallback={<Progress value={73} />}>
            <ProspectsListServer />
        </Suspense>
    );
}