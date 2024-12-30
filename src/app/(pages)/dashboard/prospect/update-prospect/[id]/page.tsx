import { ProspectService } from '@services/prospects/prospects.service';
import { EditProspectForm } from '@dashboard/prospect/update-prospect/components/EditProspectForm';
import { notFound } from 'next/navigation';
import { ProspectWithId } from '@/libs/schemas/prospect-schema';
import { getProspect } from '@/_actions/prospects/prospects.action';

interface EditPageProps {
    params: { id: string };
}

export default async function EditProspectPage({ params }: EditPageProps) {
    const prospect = await getProspect(params.id);
    if (!prospect) {
        notFound();
    }
    console.log(prospect);

    return (
        <EditProspectForm prospect={prospect as ProspectWithId} />
    );
}
