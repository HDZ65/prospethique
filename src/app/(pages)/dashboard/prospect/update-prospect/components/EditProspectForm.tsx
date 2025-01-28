'use client';

import { FC, useState } from 'react';
import { Users, Loader2} from 'lucide-react';
import { ProspectWithId, STATUTS, UpdateProspect } from '@/lib/schemas/prospect-schema';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'react-hot-toast';
import { updateProspect } from '@/_actions/prospects/prospects.action';
import { ConfirmModal } from '@/components/confirm-modal';
import { FormField } from '@/components/form/form-field';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'date';
  placeholder: string;
}

const FORM_FIELDS: FormField[] = [
  { id: 'site', label: 'Site web', type: 'url', placeholder: 'https://www.example.com' },
  { id: 'contact', label: 'Contact', type: 'text', placeholder: 'M. John Doe' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
  { id: 'statut', label: 'Statut', type: 'select', placeholder: 'Sélectionnez un statut' },
  { id: 'dateRelanceOptimale', label: 'Date de relance', type: 'date', placeholder: 'Date de relance' },
  { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Ajoutez vos notes ici...' },
];

interface EditProspectFormProps {
  prospect: ProspectWithId;
}

export const EditProspectForm: FC<EditProspectFormProps> = ({ prospect: initialProspect }) => {
  const [prospect, setProspect] = useState<UpdateProspect>({
    ...initialProspect,
    dateRelanceOptimale: initialProspect.dateRelanceOptimale
      ? initialProspect.dateRelanceOptimale.split('T')[0]
      : ''
  });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const { execute, status, result } = useAction(updateProspect, {
    onSuccess: () => {
      toast.success("Prospect modifié avec succès, redirection vers la liste des prospects...");
      router.push('/dashboard');
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.error?.serverError || "Erreur lors de la modification");
    }
  });

  const router = useRouter();
  const isLoading = status === 'executing';

  const handleFieldChange = (id: string, value: string) => {
    setProspect(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleConfirmEdit = () => {
    const formData = new FormData();
    Object.entries(prospect).forEach(([key, value]) => {
      formData.append(key, value || '');
    });
    execute(formData);
    setConfirmModalOpen(false);
  };

  return (
    <>
      <section className="bg-gradient-glass backdrop-blur-glass rounded-lg px-4 py-6 shadow-glass max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="p-2 rounded-lg bg-muted/60 border border-white/5">
            <Users className="w-5 h-5 text-primary" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-medium text-text-primary">
            Modifier le prospect
          </h1>
        </div>

        <form action={execute} className="space-y-5" noValidate>
          {FORM_FIELDS.map((field) => (
            <div key={field.id} className="space-y-2">
              <FormField
                {...field}
                name={field.id}
                value={prospect[field.id as keyof typeof prospect] || ''}
                options={field.type === 'select' ? [...STATUTS] : undefined}
                error={result?.validationErrors?.[field.id as keyof typeof prospect]?._errors}
                disabled={isLoading}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
              {result?.validationErrors?.[field.id as keyof typeof prospect]?._errors && (
                <p className="text-red-500 text-sm">
                  {result?.validationErrors?.[field.id as keyof typeof prospect]?._errors?.[0] || ''}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Modification...
                </>
              ) : (
                'Modifier'
              )}
            </Button>
          </div>
        </form>
      </section>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmer la modification"
        description="Êtes-vous sûr de vouloir enregistrer ces modifications ?"
        confirmText="Modifier"
      />
    </>
  );
}; 