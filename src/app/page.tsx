'use client'
import { ProspectsList } from "@/components/ProspectsList";
import { useAction } from "next-safe-action/hooks";
import { getProspects } from "@/app/actions/prospects-action";
import { useEffect } from "react";
import { AddProspectForm } from "@/components/AddProspectForm";

export default function Page() {

  const { execute, result } = useAction(getProspects);

  useEffect(() => {
    execute()
  }, [execute]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex gap-6">
      <ProspectsList prospects={result?.data?.prospects || []} />
      <AddProspectForm />
    </div>
  );
}
