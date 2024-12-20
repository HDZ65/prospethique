'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    prospectName: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, prospectName }: DeleteConfirmModalProps) => {
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-gradient-glass backdrop-blur-glass rounded-lg border border-white/10 shadow-glass overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-text-primary mb-2">
                                        Confirmer la suppression
                                    </h3>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Êtes-vous sûr de vouloir supprimer le prospect {prospectName} ? Cette action est irréversible.
                                    </p>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={onConfirm}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-150 text-sm font-medium"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 