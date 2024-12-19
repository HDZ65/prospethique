'use client'
import { ProspectsList } from "@/components/ProspectsList";
import { useAction } from "next-safe-action/hooks";
import { getProspects } from "@/app/actions/prospects-action";
import { useEffect } from "react";

export default function Page() {

  const { execute, result } = useAction(getProspects);

  useEffect(() => {
    execute()
  }, [execute]);

  return (
    <div className="container mx-auto py-24">
      <ProspectsList prospects={result?.data?.prospects || []} />
    </div>
  );
}
