'use client';

import { FC, useState } from 'react';
import { Users, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { ProspectWithId, STATUTS } from '@/libs/schemas/prospect-schema';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/libs/utils/core/cn";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'react-hot-toast';
import { updateProspect } from '@/_actions/prospects/prospects.action';
import { ConfirmModal } from '@/components/confirm-modal';

interface FormField {
  id: keyof Omit<ProspectWithId, 'dateCreation'>;
  label: string;
  type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'date';
  placeholder: string;
  required?: boolean;
}

const FORM_FIELDS: FormField[] = [
  { id: 'site', label: 'Site web', type: 'url', placeholder: 'https://www.example.com', required: true },
  { id: 'contact', label: 'Contact', type: 'text', placeholder: 'M. John Doe', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'john.doe@example.com', required: true },
  { id: 'statut', label: 'Statut', type: 'select', placeholder: 'Sélectionnez un statut', required: true },
  { id: 'dateRelanceOptimale', label: 'Date de relance', type: 'date', placeholder: 'Date de relance', required: true },
  { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Ajoutez vos notes ici...' },
];

const styles = {
  input: "bg-muted/60 border-white/10 shadow-input placeholder:text-text-tertiary focus:border-primary/30 hover:border-white/20",
  label: "text-sm font-medium text-text-secondary",
};

interface EditProspectFormProps {
  prospect: ProspectWithId;
}

export const EditProspectForm: FC<EditProspectFormProps> = ({
  prospect: initialProspect,
}) => {
  const [prospect, setProspect] = useState({
    ...initialProspect,
    dateRelanceOptimale: initialProspect.dateRelanceOptimale.split('T')[0] // Formatage de la date pour l'input
  });
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const { execute, status } = useAction(updateProspect, {
    onSuccess: () => {
      toast.success("Prospect modifié avec succès, redirection vers la liste des prospects...");
      setTimeout(() => {
        router.back();
      }, 1000);
    },
    onError: (error) => {
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
    formData.append('id', prospect.id);
    formData.append('site', prospect.site);
    formData.append('contact', prospect.contact);
    formData.append('email', prospect.email);
    formData.append('statut', prospect.statut);
    formData.append('dateRelanceOptimale', new Date(prospect.dateRelanceOptimale).toISOString());
    formData.append('notes', prospect.notes || '');
    execute(formData);
    setConfirmModalOpen(false);
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      value: prospect[field.id],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleFieldChange(field.id, e.target.value),
      disabled: isLoading,
      className: styles.input,
    };

    switch (field.type) {
      case 'select':
        return (
          <Select 
            name={field.id}
            value={prospect[field.id]}
            onValueChange={(value) => handleFieldChange(field.id, value)}
          >
            <SelectTrigger className={styles.input}>
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
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !prospect[field.id] && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {prospect[field.id] ? (
                  format(new Date(prospect[field.id]), "d MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={prospect[field.id] ? new Date(prospect[field.id]) : undefined}
                onSelect={(date) => 
                  handleFieldChange(field.id, date ? date.toISOString().split('T')[0] : '')
                }
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return <Input {...commonProps} type={field.type} />;
    }
  };

  return (
    <>
      <section className="bg-gradient-glass backdrop-blur-glass rounded-lg px-4 py-6 shadow-glass max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="p-2 rounded-lg bg-muted/60 border border-white/5">
            <Users className="w-5 h-5 text-primary" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-medium text-text-primary">
            Modifier le prospect
          </h1>
        </div>

        <form action={execute} className="space-y-5" noValidate>
          {FORM_FIELDS.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className={styles.label}>
                {field.label}
              </label>
              {renderField(field)}
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