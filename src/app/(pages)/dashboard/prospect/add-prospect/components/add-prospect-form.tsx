'use client';

import { FC, useState } from 'react';
import { STATUTS } from '@/lib/schemas/prospect-schema';
import { Users } from 'lucide-react';
import { AddProspectActionResult } from '@/_actions/prospects/prospects.action';
import { Button } from "@/components/ui/button";
import { FormField } from '@/components/form/form-field';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'select' | 'textarea';
  placeholder: string;
}

const FORM_FIELDS: FormField[] = [
  { id: 'site', label: 'Site web', type: 'url', placeholder: 'https://www.example.com' },
  { id: 'contact', label: 'Contact', type: 'text', placeholder: 'M. John Doe' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
  { id: 'statut', label: 'Statut', type: 'select', placeholder: 'Sélectionnez un statut' },
  { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Ajoutez vos notes ici...' },
];

interface AddProspectFormProps {
  execute: (data: FormData) => void;
  result: AddProspectActionResult & { validationErrors?: { [key: string]: { _errors: string[] } } };
  isExecuting: boolean;
}

export const AddProspectForm: FC<AddProspectFormProps> = ({ execute, result, isExecuting }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    site: '',
    contact: '',
    email: '',
    statut: '',
    notes: '',
  });

  const handleFieldChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value || '');
    });
    execute(formDataToSubmit);
  };
  
  return (
    <section className="bg-gradient-glass backdrop-blur-glass rounded-lg px-4 py-6 shadow-glass max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="p-2 rounded-lg bg-muted/60 border border-white/5">
          <Users className="w-5 h-5 text-primary" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-medium text-text-primary">Nouveau prospect</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {FORM_FIELDS.map((field) => (
          <div key={field.id} className="space-y-2">
            <FormField
              {...field}
              name={field.id}
              value={formData[field.id]}
              options={field.type === 'select' ? [...STATUTS] : undefined}
              error={result?.validationErrors?.[field.id]?._errors}
              disabled={isExecuting}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
            {result?.validationErrors?.[field.id]?._errors && (
              <p className="text-red-500 text-sm">
                {result?.validationErrors?.[field.id]?._errors?.[0] || ''}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? 'Ajout en cours...' : 'Ajouter le prospect'}
        </Button>
      </form>
    </section>
  );
};