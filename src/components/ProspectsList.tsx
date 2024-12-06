'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Calendar, MoreVertical, Search, Pencil, Trash2, X } from 'lucide-react';
import { Prospect } from '@/schemas';
import Link from 'next/link';
import { deleteProspect } from '@/app/actions/prospects-action';
import { Toast } from '@/components/ui/Toast';

interface ProspectsListProps {
  prospects: Array<Prospect & { id: string }>;
}

export const ProspectsList = ({ prospects }: ProspectsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredProspects = prospects.filter(prospect => 
    prospect.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      const result = await deleteProspect(id);
      if (result.success) {
        setToast({ type: 'success', message: 'Prospect supprimé avec succès' });
      } else {
        setToast({ type: 'error', message: result.error || 'Erreur lors de la suppression' });
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-gradient-glass backdrop-blur-glass rounded-lg border border-white/10 
                   shadow-glass overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 rounded-lg bg-surface/80 border border-white/5"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                <Users className="w-5 h-5 text-primary" />
              </motion.div>
              <h2 className="text-xl font-medium text-text-primary">
                Liste des prospects
              </h2>
            </div>
            <Link
              href="/prospects/add"
              className="bg-primary hover:bg-primary-dark text-text-primary 
                       px-4 py-2 rounded-lg transition-colors duration-150
                       flex items-center gap-2 text-sm font-medium"
            >
              Nouveau prospect
            </Link>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="search"
              placeholder="Rechercher un prospect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface/80 px-4 py-2.5 pl-10 rounded-lg
                       border border-white/10 text-text-primary
                       shadow-input placeholder-text-tertiary
                       focus:border-primary/30 focus:ring-0
                       hover:border-white/20
                       transition-all duration-150"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          </div>
        </div>

        {/* Liste */}
        <div className="divide-y divide-white/10">
          {filteredProspects.map((prospect, index) => (
            <motion.div
              key={prospect.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="p-4 hover:bg-surface/40 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-text-primary font-medium truncate">
                      {prospect.entreprise}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${prospect.statut === 'À contacter' ? 'bg-yellow-500/10 text-yellow-400' :
                        prospect.statut === 'Accepté' ? 'bg-green-500/10 text-green-400' :
                        prospect.statut === 'Refusé' ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'}`}
                    >
                      {prospect.statut}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{prospect.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(prospect.dateCreation)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === prospect.id ? null : prospect.id)}
                    className="p-2 hover:bg-surface rounded-full transition-colors duration-150"
                  >
                    <MoreVertical className="w-5 h-5 text-text-tertiary" />
                  </button>

                  {/* Menu contextuel */}
                  {activeMenu === prospect.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-surface border border-white/10 shadow-lg overflow-hidden">
                      <Link
                        href={`/prospects/${prospect.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-white/5"
                      >
                        <Pencil className="w-4 h-4" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(prospect.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 w-full text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredProspects.length === 0 && (
            <div className="p-8 text-center text-text-secondary">
              Aucun prospect trouvé
            </div>
          )}
        </div>
      </motion.div>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}; 