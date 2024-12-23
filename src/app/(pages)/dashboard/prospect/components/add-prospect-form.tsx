'use client';

import { STATUTS } from '@/libs/schemas/prospect-schema';
import { Users } from 'lucide-react';
import { AddProspectActionResult } from '@/_actions/prospects/prospects.action';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils/core/cn";

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'select' | 'textarea';
  placeholder: string;
  required?: boolean;
}

const FORM_FIELDS: FormField[] = [
  { id: 'site', label: 'Site web', type: 'url', placeholder: 'https://www.example.com', required: true },
  { id: 'contact', label: 'Contact', type: 'text', placeholder: 'M. John Doe', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com', required: true },
  { id: 'statut', label: 'Statut', type: 'select', placeholder: 'Sélectionnez un statut', required: true },
  { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Ajoutez vos notes ici...' },
];

const styles = {
  input: "bg-muted/60 border-white/10 shadow-input placeholder:text-text-tertiary focus:border-primary/30 hover:border-white/20",
  label: "text-sm font-medium text-text-secondary",
};

interface AddProspectFormProps {
  execute: (data: FormData) => void;
  result: AddProspectActionResult & { validationErrors?: { [key: string]: { _errors: string[] } } };
  isExecuting: boolean;
  hasSucceeded: boolean;
  hasErrored: boolean;
}

export const AddProspectForm = ({ execute, result, isExecuting, hasSucceeded, hasErrored }: AddProspectFormProps) => {
  const renderField = (field: FormField) => {
    const error = result?.validationErrors?.[field.id]?._errors;
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      className: cn(styles.input, error && "border-red-500"),
    };

    switch (field.type) {
      case 'select':
        return (
          <Select name={field.id} defaultValue={STATUTS[0]}>
            <SelectTrigger className={cn(styles.input, error && "border-red-500")}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>{statut}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return <Textarea {...commonProps} rows={4} className={cn(commonProps.className, "resize-none")} />;
      default:
        return <Input {...commonProps} type={field.type} />;
    }
  };

  return (
    <section className="bg-gradient-glass backdrop-blur-glass rounded-lg p-6 border border-white/10 shadow-glass mx-auto w-4/5">
      <div className="flex items-center gap-3 mb-8">
        <span className="p-2 rounded-lg bg-muted/60 border border-white/5">
          <Users className="w-5 h-5 text-primary" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-medium text-text-primary">Nouveau prospect</h1>
      </div>

      <form action={execute} className="space-y-5">
        {FORM_FIELDS.map((field) => (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className={styles.label}>{field.label}</label>
            {renderField(field)}
            {result?.validationErrors?.[field.id]?._errors && (
              <p className="text-red-500 text-sm">{result.validationErrors[field.id]._errors[0]}</p>
            )}
          </div>
        ))}

        {hasSucceeded && result.data?.message && (
          <div className="text-green-500 mt-4 text-center">{result.data.message}</div>
        )}
        {hasErrored && result?.validationErrors && (
          <div className="text-red-500 mt-4 text-center">
            {result.validationErrors._errors?._errors || "Erreur inconnue"}
          </div>
        )}

        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? 'Ajout en cours...' : 'Ajouter le prospect'}
        </Button>
      </form>
    </section>
  );
};