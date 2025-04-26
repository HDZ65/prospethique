"use client"

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

// Interface pour les blocs d'email (à affiner)
interface EmailBlock {
  id: string;
  type: string; // ex: 'mj-section', 'mj-text'
  // ... autres propriétés (contenu, attributs)
}

interface EmailCanvasProps {
  blocks: EmailBlock[]; // Les blocs actuels de l'email
}

export function EmailCanvas({ blocks }: EmailCanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'email-canvas', // ID unique pour cette zone de dépôt
  });

  return (
    <div
      ref={setNodeRef} // Référence pour dnd-kit
      className={cn(
        'flex-1 bg-neutral-100 p-4 overflow-y-auto',
        'min-h-[400px]', // Hauteur minimale pour être visible
        'border-2 border-dashed border-transparent',
        isOver && 'border-blue-500 bg-blue-50' // Style quand un élément est en survol
      )}
    >
      {blocks.length === 0 ? (
        <div className="flex items-center justify-center h-full text-neutral-500">
          Déposez des éléments ici pour commencer à construire votre email.
        </div>
      ) : (
        <div className="space-y-2">
          {blocks.map((block) => (
            // TODO: Afficher une représentation du bloc MJML
            <div key={block.id} className="p-4 border bg-white rounded shadow-sm">
              Bloc de type: {block.type} (ID: {block.id})
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 