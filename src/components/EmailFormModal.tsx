'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useEmailForm } from '@/hooks/useEmailForm';
import { useEffect, useState, KeyboardEvent } from 'react';
import { ProspectWithId } from '@/schemas/prospect-schema';

interface EmailFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    prospect: ProspectWithId;
}

export const EmailFormModal = ({ isOpen, onClose, prospect }: EmailFormModalProps) => {
    const { 
        formData, 
        isLoading, 
        error, 
        handleChange, 
        handleSubmit,
        handleAddAmelioration,
        handleRemoveAmelioration 
    } = useEmailForm(() => {
        onClose();
    }, prospect);

    const [newAmelioration, setNewAmelioration] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddAmelioration(newAmelioration);
            setNewAmelioration('');
        }
    };

    // Gestion de la touche Escape pour fermer la modale
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape as unknown as EventListener);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape as unknown as EventListener);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Contenu de la modale */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-black/50 backdrop-blur-glass rounded-lg border border-white/10 shadow-glass overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 id="modal-title" className="text-xl font-medium text-text-primary">
                                    Envoyer un email à {prospect.contact}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-surface rounded-full transition-colors duration-150"
                                    aria-label="Fermer"
                                >
                                    <X className="w-5 h-5 text-text-tertiary" />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                {/* Informations du prospect (en lecture seule) */}
                                <div className="bg-surface/90 p-6 rounded-lg space-y-2">
                                    <p className="text-sm text-text-secondary">
                                        <span className="font-medium">Contact :</span> {prospect.contact}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        <span className="font-medium">Email :</span> {prospect.email}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        <span className="font-medium">Site web :</span> {prospect.site}
                                    </p>
                                </div>

                                {/* Liste des améliorations */}
                                <div className="mt-6">
                                    <label className="block text-base font-medium text-text-secondary mb-2">
                                        Liste des améliorations à apporter :
                                    </label>
                                    <div className="space-y-6">
                                        {/* Input pour ajouter une amélioration */}
                                        <div className="flex items-start gap-6 ">
                                            <textarea
                                                cols={0}
                                                rows={3}
                                                value={newAmelioration}
                                                onChange={(e) => setNewAmelioration(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Ajouter une amélioration..."
                                                className="flex-1 bg-surface/90 px-4 py-2 rounded-lg border border-white/10 text-text-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleAddAmelioration(newAmelioration);
                                                    setNewAmelioration('');
                                                }}
                                                className="p-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors duration-150"
                                            >
                                                <Plus className="w-5 h-5 text-text-primary" />
                                            </button>
                                        </div>

                                        {/* Liste des améliorations */}
                                        <div className="space-y-6">
                                            <AnimatePresence>
                                                {formData.ameliorationList.map((amelioration, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="flex items-center justify-between bg-surface/90 px-4 py-2 rounded-lg"
                                                    >
                                                        <span className="text-sm text-text-primary">{amelioration}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAmelioration(index)}
                                                            className="p-2 hover:bg-surface/60 rounded-full transition-colors duration-150"
                                                            aria-label="Supprimer l'amélioration"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-400" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Groupe des champs de recherche */}
                                <div className="grid gap-6 mt-6">
                                    {/* Recherche */}
                                    <div>
                                        <label className="block text-base font-medium text-text-secondary mb-2">
                                            Lors de mes recherches sur ...
                                        </label>
                                        <input
                                            type="text"
                                            id="recherche"
                                            name="recherche"
                                            value={formData.recherche}
                                            onChange={handleChange}
                                            placeholder="ex: les agences web"
                                            className="w-full bg-surface/90 px-4 py-2 rounded-lg border border-white/10 text-text-primary"
                                        />
                                    </div>

                                    {/* Mot clé */}
                                    <div>
                                        <label className="block text-base font-medium text-text-secondary mb-2">
                                            Avec le mot clé ...
                                        </label>
                                        <input
                                            type="text"
                                            id="motCle"
                                            name="motCle"
                                            value={formData.motCle}
                                            onChange={handleChange}
                                            placeholder="ex: agence web"
                                            className="w-full bg-surface/90 px-4 py-2 rounded-lg border border-white/10 text-text-primary"
                                        />
                                    </div>

                                    {/* Numéro de page */}
                                    <div>
                                        <label className="block text-base font-medium text-text-secondary mb-2">
                                            On a trouvé votre site sur la page ...
                                        </label>
                                        <input
                                            type="number"
                                            id="numeroPage"
                                            name="numeroPage"
                                            value={formData.numeroPage}
                                            onChange={handleChange}
                                            placeholder="ex: 6"
                                            min="1"
                                            className="w-full bg-surface/90 px-4 py-2 rounded-lg border border-white/10 text-text-primary"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div id="email-error" className="text-red-400 text-sm mt-6 p-6 bg-red-400/10 rounded-lg" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end gap-6 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-primary hover:bg-primary-dark text-text-primary px-4 py-2 rounded-lg transition-colors duration-150 flex items-center gap-4 text-sm font-medium disabled:opacity-50"
                                    >
                                        {isLoading ? 'Envoi en cours...' : 'Envoyer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Modale de confirmation */}
                    <AnimatePresence>
                        {showConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-60 flex items-center justify-center p-4"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) setShowConfirm(false);
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                                />

                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    className="relative w-full max-w-md bg-gradient-glass backdrop-blur-glass rounded-lg border border-white/10 shadow-glass overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                                <AlertCircle className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-text-primary mb-2">
                                                    Confirmer l&apos;envoi
                                                </h3>
                                                <p className="text-sm text-text-secondary mb-4">
                                                    Voulez-vous envoyer cet email à {prospect.contact} ({prospect.email}) ?
                                                </p>
                                                
                                                {/* Résumé des données */}
                                                <div className="bg-surface/90 p-3 rounded-lg space-y-2 mb-4">
                                                    {formData.ameliorationList.length > 0 && (
                                                        <div className="text-sm text-text-secondary">
                                                            <span className="font-medium">Améliorations :</span>
                                                            <ul className="list-disc list-inside ml-2">
                                                                {formData.ameliorationList.map((item, index) => (
                                                                    <li key={index}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {formData.recherche && (
                                                        <p className="text-sm text-text-secondary">
                                                            <span className="font-medium">Recherche :</span> {formData.recherche}
                                                        </p>
                                                    )}
                                                    {formData.motCle && (
                                                        <p className="text-sm text-text-secondary">
                                                            <span className="font-medium">Mot clé :</span> {formData.motCle}
                                                        </p>
                                                    )}
                                                    {formData.numeroPage && (
                                                        <p className="text-sm text-text-secondary">
                                                            <span className="font-medium">Page :</span> {formData.numeroPage}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirm(false)}
                                                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowConfirm(false);
                                                            handleSubmit();
                                                        }}
                                                        disabled={isLoading}
                                                        className="bg-primary hover:bg-primary-dark text-text-primary px-4 py-2 rounded-lg transition-colors duration-150 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {isLoading ? 'Envoi en cours...' : 'Confirmer l\'envoi'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 