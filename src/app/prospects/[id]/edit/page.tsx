import { getProspects } from '@/app/actions/prospects-action';
import { EditProspectForm } from '@/components/EditProspectForm';

export default async function EditProspectPage({ params }: { params: { id: string } }) {
  const prospects = await getProspects();
  const prospect = prospects.find(p => p.id === params.id);

  if (!prospect) {
    return <div>Prospect non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <EditProspectForm prospect={prospect} />
    </div>
  );
} 