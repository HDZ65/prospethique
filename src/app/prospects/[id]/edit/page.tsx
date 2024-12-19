'use client'

import { getProspects } from '@/app/actions/prospects-action';
import { EditProspectForm } from '@/components/EditProspectForm';
import { useEffect } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { use } from 'react';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProspectPage({ params }: EditPageProps) {
  const resolvedParams = use(params);
  const { execute, result } = useAction(getProspects);

  useEffect(() => {
    execute();
  }, [execute]);

  const prospect = result?.data?.prospects?.find(
    p => p.id === resolvedParams.id
  );

  if (!prospect) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-text-secondary">
        Prospect non trouvé
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <EditProspectForm prospect={prospect} />
    </div>
  );
}
