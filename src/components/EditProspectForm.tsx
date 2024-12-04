'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Prospect } from '@/schemas';
import { updateProspect } from '@/app/actions/prospects-action';
import { Toast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

interface EditProspectFormProps {
  prospect: Prospect & { id: string };
}

export const EditProspectForm: FC<EditProspectFormProps> = ({ prospect }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    entreprise: prospect.entreprise,
    contact: prospect.contact,
    email: prospect.email,
    statut: prospect.statut,
    notes: prospect.notes,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateProspect(prospect.id, formData);
      if (result.success) {
        setToast({ type: 'success', message: 'Prospect modifié avec succès' });
        setTimeout(() => {
          router.push('/prospects');
          router.refresh();
        }, 1500);
      } else {
        setToast({ type: 'error', message: result.error || 'Erreur lors de la modification' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Une erreur est survenue' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-glass backdrop-blur-glass rounded-lg p-6 
                 border border-white/10 shadow-glass max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div 
          className="p-2 rounded-lg bg-surface/80 border border-white/5"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.15 }}
        >
          <Users className="w-5 h-5 text-primary" />
        </motion.div>
        <h2 className="text-xl font-medium text-text-primary">
          Modifier le prospect
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Entreprise */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Entreprise
          </label>
          <input
            type="text"
            value={formData.entreprise}
            onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
            className="w-full bg-surface/80 px-4 py-2.5 rounded-lg
                     border border-white/10 text-text-primary
                     shadow-input placeholder-text-tertiary
                     focus:border-primary/30 focus:ring-0
                     hover:border-white/20
                     transition-all duration-150"
          />
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Contact
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            className="w-full bg-surface/80 px-4 py-2.5 rounded-lg
                     border border-white/10 text-text-primary
                     shadow-input placeholder-text-tertiary
                     focus:border-primary/30 focus:ring-0
                     hover:border-white/20
                     transition-all duration-150"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full bg-surface/80 px-4 py-2.5 rounded-lg
                     border border-white/10 text-text-primary
                     shadow-input placeholder-text-tertiary
                     focus:border-primary/30 focus:ring-0
                     hover:border-white/20
                     transition-all duration-150"
          />
        </div>

        {/* Statut */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Statut
          </label>
          <select
            value={formData.statut}
            onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as Prospect['statut'] }))}
            className="w-full bg-surface/80 px-4 py-2.5 rounded-lg
                     border border-white/10 text-text-primary
                     shadow-input
                     focus:border-primary/30 focus:ring-0
                     hover:border-white/20
                     transition-all duration-150"
          >
            {['À contacter', 'Email envoyé', 'Relance', 'Accepté', 'Refusé'].map((statut) => (
              <option key={statut} value={statut} className="bg-surface text-text-primary">
                {statut}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={4}
            className="w-full bg-surface/80 px-4 py-2.5 rounded-lg
                     border border-white/10 text-text-primary
                     shadow-input placeholder-text-tertiary
                     focus:border-primary/30 focus:ring-0
                     hover:border-white/20
                     transition-all duration-150 resize-none"
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary
                     transition-colors duration-150"
          >
            Annuler
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary hover:bg-primary-dark text-white
                     px-6 py-2 rounded-lg transition-colors duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Modification...' : 'Modifier'}
          </motion.button>
        </div>
      </form>

      {/* Toast notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
}; 