'use client'
import { getProspects } from '@/app/actions/prospects-action';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { ProspectsList } from '@/components/ProspectsList';

export default function Page() {
  const { execute, result } = useAction(getProspects);

  useEffect(() => {
    execute()
  }, [execute]);

  return (
    <div className="container mx-auto px-4 py-24">
        <ProspectsList prospects={result?.data?.prospects || []} />
    </div>
  );
}