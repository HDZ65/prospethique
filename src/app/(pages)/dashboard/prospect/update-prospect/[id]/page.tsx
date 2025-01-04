import { ProspectService } from '@services/prospects/prospects.service';
import { EditProspectForm } from '@dashboard/prospect/update-prospect/components/EditProspectForm';
import { notFound } from 'next/navigation';
import { ProspectWithId } from '@/libs/schemas/prospect-schema';
import { getProspect } from '@/_actions/prospects/prospects.action';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EditPageProps {
    params: { id: string };
}

async function EditProspectPageServer({ params }: EditPageProps) {
    // Attendre que les paramètres soient disponibles
    const { id } = await Promise.resolve(params);
    
    const prospect = await getProspect(id);
    
    if (!prospect) {
        notFound();
    }

    return (
        <EditProspectForm prospect={prospect as ProspectWithId} />
    );
}

export default async function EditProspectPage(props: EditPageProps) {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <EditProspectPageServer params={props.params} />
        </Suspense>
    );
}


