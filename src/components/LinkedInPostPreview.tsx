/**
 * @title Composant de prévisualisation de post LinkedIn
 * @description Affiche un aperçu en temps réel du post LinkedIn formaté
 */

'use client';

import { MoreHorizontal, ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react';
import { ProfileImage } from './ui/ProfileImage';
import { useState } from 'react';

interface LinkedInPostPreviewProps {
  content: string;
}

export const LinkedInPostPreview = ({ content }: LinkedInPostPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fonction pour tronquer le texte à 3 lignes
  const truncateText = (text: string) => {
    const lines = text.split('\n');
    if (lines.length <= 3) return text;
    
    // Prend les 3 premières lignes
    const truncated = lines.slice(0, 3).join('\n');
    // S'assure que la dernière ligne n'est pas trop longue
    const lastLine = truncated.split('\n')[2];
    if (lastLine.length > 80) {
      return truncated.slice(0, truncated.length - (lastLine.length - 77)) + '...';
    }
    return truncated;
  };

  // Fonction pour formater le texte
  const formatText = (text: string) => {
    if (!text) return [];
    
    // Détection des emojis au début des phrases
    const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])/u;
    
    // Sépare le texte en paragraphes
    return text.split('\n').map((paragraph, index) => {
      // Gestion des citations avec emoji
      if (paragraph.match(emojiRegex)) {
        return (
          <p key={index} className="text-[14px]">
            <span className="text-[16px] mr-1">{paragraph.match(emojiRegex)?.[0]}</span>
            <span className="font-medium">
              {paragraph.replace(emojiRegex, '').trim()}
            </span>
          </p>
        );
      }

      // Gestion des questions
      if (paragraph.trim().endsWith('?')) {
        return (
          <p key={index} className="text-[14px] font-medium">
            {paragraph}
          </p>
        );
      }

      // Gestion des listes avec tirets
      if (paragraph.trim().startsWith('-')) {
        return (
          <li key={index} className="ml-4 mb-2 text-[15px]">
            {paragraph.substring(1).trim()}
          </li>
        );
      }
      
      // Gestion des hashtags
      if (paragraph.includes('#')) {
        return (
          <p key={index} className="mb-2 text-[15px]">
            {paragraph.split(' ').map((word, wordIndex) => (
              word.startsWith('#') ? (
                <span key={wordIndex} className="text-blue-600 hover:underline cursor-pointer mr-1">
                  {word}
                </span>
              ) : (
                <span key={wordIndex} className="mr-1">{word}</span>
              )
            ))}
          </p>
        );
      }

      // Paragraphes normaux
      return (
        <p key={index} className="mb-2 text-[15px]">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="w-[555px] max-w-[555px] bg-white rounded-lg shadow-sm overflow-hidden" role="article">
      {/* En-tête avec commentaire */}
      <div className="px-4 pt-3 pb-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <ProfileImage src="/thibaut-avatar.png" size={6} fallbackText="T" />
          <span className="font-medium">Thibaut Taglialatela</span>
          <span>a commenté ceci</span>
          <div className="ml-auto flex items-center">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-full ml-1">
              <span className="text-gray-600">✕</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post principal */}
      <div className="px-4 pb-2">
        {/* En-tête du post */}
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <ProfileImage src="/cedric-avatar.png" size={12} fallbackText="C" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Devethique</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">2e</span>
              </div>
              <div className="text-sm text-gray-500 leading-tight">Créateur de sites web sur-mesure et éco-responsable</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <span>1 j</span>
                <span>•</span>
                <span>🌐</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <button className="text-blue-600 font-medium text-sm px-4 py-1 rounded-full border border-blue-600 hover:bg-blue-50">
              Se connecter
            </button>
          </div>
        </div>

        {/* Contenu du post avec limitation à 3 lignes */}
        <div className="mt-3">
          <div className="relative">
            <div className={`text-[15px] leading-[1.4] text-gray-900 ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {formatText(isExpanded ? content : truncateText(content))}
              {!isExpanded && content.split('\n').length > 3 && (
                <span className="inline-block text-gray-500 hover:text-gray-700 cursor-pointer ml-1">
                  ...
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-gray-500 hover:underline ml-1 font-medium"
                  >
                    Afficher plus
                  </button>
                </span>
              )}
            </div>
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:underline mt-2 font-medium"
              >
                Afficher moins
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques d'engagement */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 mt-1">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-500">👍</span>
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-red-500">❤️</span>
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-yellow-500">🎯</span>
          </div>
          <span className="ml-1 hover:text-blue-600 hover:underline cursor-pointer">37</span>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="hover:text-blue-600 hover:underline cursor-pointer">14 commentaires</span>
          <span>•</span>
          <span className="hover:text-blue-600 hover:underline cursor-pointer">1 republication</span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="px-2 py-1 border-t border-gray-200">
        <div className="flex items-stretch">
          <button className="flex items-center gap-2 py-3 px-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
            <ThumbsUp className="w-[18px] h-[18px] text-gray-600" />
            <span className="text-[13px] font-medium text-gray-600">J&apos;aime</span>
          </button>
          <button className="flex items-center gap-2 py-3 px-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
            <MessageSquare className="w-[18px] h-[18px] text-gray-600" />
            <span className="text-[13px] font-medium text-gray-600">Commenter</span>
          </button>
          <button className="flex items-center gap-2 py-3 px-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
            <Repeat2 className="w-[18px] h-[18px] text-gray-600" />
            <span className="text-[13px] font-medium text-gray-600">Republier</span>
          </button>
          <button className="flex items-center gap-2 py-3 px-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
            <Send className="w-[18px] h-[18px] text-gray-600" />
            <span className="text-[13px] font-medium text-gray-600">Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 