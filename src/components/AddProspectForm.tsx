'use client';

// Imports
import { STATUTS } from '@/schemas/prospect-schema';
import { Users } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { addProspect } from '@/app/actions/prospects-action';

// Styles
const inputStyles = `w-full bg-surface/80 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary shadow-input placeholder-text-tertiary focus:border-primary/30 focus:ring-0 hover:border-white/20 transition-all duration-150`;
const labelStyles = "text-sm font-medium text-text-secondary";

export const AddProspectForm = () => {
  const { execute, result, isExecuting, hasSucceeded, hasErrored } = useAction(addProspect);

  return (
    <section className="bg-gradient-glass backdrop-blur-glass rounded-lg p-6 border border-white/10 shadow-glass max-w-[1200px] mx-auto">

      {/* Titre */}
      <div className="flex items-center gap-3 mb-8">
        <span className="p-2 rounded-lg bg-surface/80 border border-white/5">
          <Users className="w-5 h-5 text-primary" />
        </span>
        <h1 className="text-xl font-medium text-text-primary">
          Nouveau prospect
        </h1>
      </div>

      {/* Form */}
      <form action={execute} className="space-y-5">

        {/* Site web */}
        <div className="space-y-2">
          <label htmlFor="site" className={labelStyles}>Site web</label>
          <input
            name="site"
            id="site"
            type="url"
            className={`${inputStyles} ${result?.validationErrors?.site?._errors ? 'border-red-500' : ''}`}
            placeholder="https://www.apple.com"
          />
          {result?.validationErrors?.site?._errors && (
            <p className="text-red-500 text-sm">{result.validationErrors.site._errors[0]}</p>
          )}
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <label htmlFor="contact" className={labelStyles}>Contact</label>
          <input
            name="contact"
            id="contact"
            type="text"
            className={`${inputStyles} ${result?.validationErrors?.contact?._errors ? 'border-red-500' : ''}`}
            placeholder="M. John Doe"
          />
          {result?.validationErrors?.contact?._errors && (
            <p className="text-red-500 text-sm">{result.validationErrors.contact._errors[0]}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className={labelStyles}>Email</label>
          <input
            name="email"
            id="email"
            type="text"
            className={`${inputStyles} ${result?.validationErrors?.email?._errors ? 'border-red-500' : ''}`}
            placeholder="john.doe@example.com"
          />
          {result?.validationErrors?.email?._errors && (
            <p className="text-red-500 text-sm">{result.validationErrors.email._errors[0]}</p>
          )}
        </div>

        {/* Statut */}
        <div className="space-y-2">
          <label htmlFor="statut" className={labelStyles}>Statut</label>
          <select
            name="statut"
            id="statut"
            className={`${inputStyles} ${result?.validationErrors?.statut?._errors ? 'border-red-500' : ''}`}
          >
            {STATUTS.map((statut) => (
              <option key={statut} value={statut}>{statut}</option>
            ))}
          </select>
          {result?.validationErrors?.statut?._errors && (
            <p className="text-red-500 text-sm">{result.validationErrors.statut._errors[0]}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className={labelStyles}>Notes</label>
          <textarea
            name="notes"
            id="notes"
            rows={4}
            className={`${inputStyles} ${result?.validationErrors?.notes?._errors ? 'border-red-500' : ''}`}
            placeholder="Ajoutez vos notes ici..."
          />
          {result?.validationErrors?.notes?._errors && (
            <p className="text-red-500 text-sm">{result.validationErrors.notes._errors[0]}</p>
          )}
        </div>

        {/* Message de succès/erreur global */}
        {hasSucceeded && (
          <div className="text-green-500 mt-4 text-center">{result?.data?.message}</div>
        )}
        {hasErrored && result?.validationErrors?._errors && (
          <div className="text-red-500 mt-4 text-center">
            {result.validationErrors._errors[0]}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isExecuting}
          className="w-full bg-primary hover:bg-primary-dark text-text-primary 
                 font-medium py-3 px-4 rounded-lg shadow-button
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-150"
        >
          {isExecuting ? 'Ajout en cours...' : 'Ajouter le prospect'}
        </button>
      </form>
    </section>
  );
}; 