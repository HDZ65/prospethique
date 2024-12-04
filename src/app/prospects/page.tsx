import { ProspectsList } from '@/components/ProspectsList';
import { getProspects } from '@/app/actions/prospects-action';

export default async function ProspectsPage() {
  const prospects = await getProspects();

  return (
    <div className="container mx-auto px-4 py-16">
      <ProspectsList prospects={prospects} />
    </div>
  );
} 