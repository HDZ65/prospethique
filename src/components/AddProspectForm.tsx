'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { STATUTS, schemaProspect } from '@/schemas';
import { addProspect } from '@/app/actions/add-prospect';
import { Users } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

type FormData = Omit<z.infer<typeof schemaProspect>, 'dateCreation' | 'dateRelanceOptimale'>;

export const AddProspectForm: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    entreprise: '',
    contact: '',
    email: '',
    statut: 'À contacter',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await addProspect(formData);
      
      if (result.success) {
        setFormData({
          entreprise: '',
          contact: '',
          email: '',
          statut: 'À contacter',
          notes: '',
        });
        setErrors({});
        setToast({
          type: 'success',
          message: 'Prospect ajouté avec succès !'
        });
      } else if (result.errors) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        result.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
        setToast({
          type: 'error',
          message: 'Erreur lors de l\'ajout du prospect'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du prospect:', error);
      setToast({
        type: 'error',
        message: 'Une erreur inattendue est survenue'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-gradient-glass backdrop-blur-glass rounded-lg p-6 
                 border border-white/10 shadow-glass max-w-2xl mx-auto"
    >
      <div className="relative z-10 space-y-6">
        <motion.div 
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
        >
          <motion.div 
            className="p-2 rounded-lg bg-surface/80 border border-white/5"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Users className="w-5 h-5 text-primary" />
          </motion.div>
          <h2 className="text-xl font-medium text-text-primary">
            Nouveau prospect
          </h2>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
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
                placeholder="Apple Inc."
              />
              {errors.entreprise && (
                <p className="text-sm text-red-400 mt-1">{errors.entreprise}</p>
              )}
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
                placeholder="John Doe"
              />
              {errors.contact && (
                <p className="text-sm text-red-400 mt-1">{errors.contact}</p>
              )}
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
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as typeof STATUTS[number] }))}
                className="w-full bg-surface/80 px-4 py-2.5 rounded-lg
                         border border-white/10 text-text-primary
                         shadow-input
                         focus:border-primary/30 focus:ring-0
                         hover:border-white/20
                         transition-all duration-150"
              >
                {STATUTS.map((statut) => (
                  <option key={statut} value={statut} className="bg-surface text-text-primary">
                    {statut}
                  </option>
                ))}
              </select>
              {errors.statut && (
                <p className="text-sm text-red-400 mt-1">{errors.statut}</p>
              )}
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
                placeholder="Ajoutez vos notes ici..."
              />
              {errors.notes && (
                <p className="text-sm text-red-400 mt-1">{errors.notes}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="w-full bg-primary hover:bg-primary-dark
                       text-text-primary font-medium py-3 px-4 rounded-lg
                       shadow-button mt-4
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150
                       flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                'Ajouter le prospect'
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 